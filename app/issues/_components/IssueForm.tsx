"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Issue } from "@prisma/client";
import { Callout } from "@radix-ui/themes";
import LabelInputContainer from "./LabelInputContainer";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

enum Status {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
      status: issue?.status || Status.OPEN,
    },
  });

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setValue("description", quill.root.innerHTML);
      });

      if (issue?.description) {
        quill.clipboard.dangerouslyPasteHTML(issue.description);
      }
    }
  }, [quill, setValue, issue]);

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
        setError(
          error.response?.data?.message || "An unexpected error occurred."
        );
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
            <h1 className="text-2xl font-bold">Submit </h1>

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

            <LabelInputContainer>
              <div ref={quillRef} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <select
                id="status"
                className="w-full"
                {...register("status", { required: "Status is required" })}
              >
                <option value={Status.OPEN}>Open</option>
                <option value={Status.IN_PROGRESS}>In Progress</option>
                <option value={Status.DONE}>Done</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </LabelInputContainer>

            <button
              disabled={isSubmitting}
              className={`w-full sm:w-auto rounded-full uppercase px-4 py-2 text-white bg-gradient-to-r from-[#4B1E7F] to-[#FC6617] mt-4 text-xs font-bold ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;
