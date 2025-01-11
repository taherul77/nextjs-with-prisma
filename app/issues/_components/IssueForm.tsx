"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Issue } from "@prisma/client";
import { Callout } from "@radix-ui/themes";
import LabelInputContainer from "./LabelInputContainer";

// ✅ Import Quill.js editor and styles
import { QuillEditor, useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Quill's default snow theme

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();

  // ✅ Setup form with useForm
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
    },
  });

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  // ✅ Quill editor setup
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
      ],
    },
    placeholder: "Write your cover letter here...",
  });

  // ✅ Update form state when Quill editor content changes
  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setValue("description", quill.root.innerHTML);
      });
    }
  }, [quill, setValue]);

  // ✅ Form submission handler
  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) {
        await axios.patch("/api/issues/" + issue.id, data);
      } else {
        await axios.post("/api/issues", data);
      }
      router.push("/issues");
      router.refresh();
    } catch (error: unknown) {
      setSubmitting(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  });

  return (
    <div>
      <div className="max-w-xl">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <div>
          <form
            className="space-y-6 border-2 rounded-lg p-4 shadow-xl"
            onSubmit={onSubmit}
          >
            <h1 className="text-2xl font-bold">Submit Your Application</h1>

            {/* ✅ Title Input */}
            <LabelInputContainer>
              <input
                id="title"
                placeholder="Title"
                type="text"
                className="w-full"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </LabelInputContainer>

            {/* ✅ Description Quill Editor */}
            <LabelInputContainer>
              <div ref={quillRef} />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </LabelInputContainer>

            {/* ✅ Submit Button */}
            <button
              disabled={isSubmitting}
              className={`w-full sm:w-auto rounded-full uppercase px-4 py-2 text-white bg-gradient-to-r from-[#4B1E7F] to-[#FC6617] mt-4 text-xs font-bold ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Send Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;
