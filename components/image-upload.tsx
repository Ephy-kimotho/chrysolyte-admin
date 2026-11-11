"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { acceptedImageTypes, imageUploadHint } from "@/lib/schemas/files"
import { cn } from "@/lib/utils"

type ImageUploadBaseProps = {
  id?: string
  /** Comma-separated MIME types for the file picker. */
  accept?: string
  /** Short text under the control, e.g. allowed types and size. */
  hint?: string
  disabled?: boolean
  /** Outlines the control in the error color. */
  "aria-invalid"?: boolean
  onBlur?: () => void
  className?: string
  ref?: React.Ref<HTMLButtonElement>
}

type SingleImageUploadProps = ImageUploadBaseProps & {
  multiple?: false
  value: File | null
  onChange: (file: File | null) => void
  /** Preview shape. "circle" suits profile photos. */
  shape?: "square" | "circle"
}

type MultipleImageUploadProps = ImageUploadBaseProps & {
  multiple: true
  value: File[]
  onChange: (files: File[]) => void
  /** Stops accepting images once this many are chosen. */
  maxFiles?: number
}

export type ImageUploadProps = SingleImageUploadProps | MultipleImageUploadProps

/**
 * Image picker with drag and drop and previews. Pass `multiple` to collect a
 * list of images; otherwise it holds one. It doesn't validate: pair it with
 * `imageFileSchema` / `imageFilesSchema` from `lib/schemas/files` so problems
 * show as field errors.
 */
export function ImageUpload(props: ImageUploadProps) {
  return props.multiple ? (
    <MultipleImageUpload {...props} />
  ) : (
    <SingleImageUpload {...props} />
  )
}

/** Shows a local file. The `blob:` URL is set on the element and revoked on change or unmount. */
function FilePreview({ file, className }: { file: File; className?: string }) {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const image = imageRef.current
    if (!image) return
    const url = URL.createObjectURL(file)
    image.src = url
    return () => {
      image.removeAttribute("src")
      URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    // next/image adds nothing for a temporary blob: URL.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imageRef}
      alt={`Preview of ${file.name}`}
      className={cn("size-full object-cover", className)}
    />
  )
}

/** File input, click-to-browse and drag-and-drop handling shared by both modes. */
function useFilePicker({
  multiple,
  disabled,
  onFiles,
}: {
  multiple: boolean
  disabled?: boolean
  onFiles: (files: File[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function browse() {
    if (!disabled) inputRef.current?.click()
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    // Clear the input so choosing the same file again still fires a change.
    event.target.value = ""
    if (files.length > 0) onFiles(files)
  }

  const dropzoneProps = {
    onDragOver(event: React.DragEvent) {
      event.preventDefault()
      if (!disabled) setIsDragging(true)
    },
    onDragLeave(event: React.DragEvent) {
      // Ignore leaving into a child element.
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setIsDragging(false)
      }
    },
    onDrop(event: React.DragEvent) {
      event.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const files = Array.from(event.dataTransfer.files)
      if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1))
    },
  }

  return { inputRef, isDragging, browse, handleInputChange, dropzoneProps }
}

function HiddenFileInput({
  inputRef,
  accept,
  multiple,
  onChange,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  accept: string
  multiple: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      tabIndex={-1}
      aria-hidden="true"
      onChange={onChange}
      className="sr-only"
    />
  )
}

function SingleImageUpload({
  id,
  accept = acceptedImageTypes.join(","),
  hint = imageUploadHint,
  disabled,
  "aria-invalid": ariaInvalid,
  onBlur,
  className,
  ref,
  value,
  onChange,
  shape = "square",
}: SingleImageUploadProps) {
  const picker = useFilePicker({
    multiple: false,
    disabled,
    onFiles: (files) => onChange(files[0]),
  })

  return (
    <div
      {...picker.dropzoneProps}
      className={cn(
        "flex items-center gap-4 rounded-xl border border-dashed border-input p-3 transition-colors",
        picker.isDragging && "border-ring bg-ring/10",
        ariaInvalid && "border-destructive",
        className
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        onClick={picker.browse}
        disabled={disabled}
        aria-hidden="true"
        className={cn(
          "flex size-20 shrink-0 items-center justify-center overflow-hidden bg-background/60 text-muted-foreground ring-1 ring-input",
          shape === "circle" ? "rounded-full" : "rounded-xl"
        )}
      >
        {value ? (
          <FilePreview file={value} />
        ) : (
          <ImagePlus strokeWidth={1.5} className="size-7" />
        )}
      </button>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            ref={ref}
            id={id}
            type="button"
            variant="outline"
            onClick={picker.browse}
            onBlur={onBlur}
            disabled={disabled}
            className="h-9 rounded-full px-4"
          >
            <Upload aria-hidden="true" />
            {value ? "Change" : "Upload"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChange(null)}
              disabled={disabled}
              className="h-9 rounded-full px-4 text-muted-foreground"
            >
              Remove
            </Button>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {value ? value.name : `Drag an image here or upload one. ${hint}`}
        </p>
      </div>

      <HiddenFileInput
        inputRef={picker.inputRef}
        accept={accept}
        multiple={false}
        onChange={picker.handleInputChange}
      />
    </div>
  )
}

function MultipleImageUpload({
  id,
  accept = acceptedImageTypes.join(","),
  hint = imageUploadHint,
  disabled,
  "aria-invalid": ariaInvalid,
  onBlur,
  className,
  ref,
  value,
  onChange,
  maxFiles,
}: MultipleImageUploadProps) {
  const remaining = maxFiles === undefined ? Infinity : maxFiles - value.length
  const isFull = remaining <= 0
  const picker = useFilePicker({
    multiple: true,
    disabled: disabled || isFull,
    onFiles: (files) => onChange([...value, ...files.slice(0, remaining)]),
  })

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {!isFull && (
        <button
          ref={ref}
          id={id}
          type="button"
          onClick={picker.browse}
          onBlur={onBlur}
          disabled={disabled}
          {...picker.dropzoneProps}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background/60 px-4 py-6 text-center transition-colors outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
            picker.isDragging && "border-ring bg-ring/10",
            ariaInvalid && "border-destructive"
          )}
        >
          <ImagePlus
            aria-hidden="true"
            strokeWidth={1.5}
            className="size-7 text-muted-foreground"
          />
          <span className="text-sm font-medium">
            Drag images here or{" "}
            <span className="text-primary underline underline-offset-4">
              browse
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            {hint}
            {maxFiles !== undefined && ` Up to ${maxFiles} images.`}
          </span>
        </button>
      )}

      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((file, index) => (
            <li
              // Files have no id; name, size and position tell them apart.
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="relative aspect-square overflow-hidden rounded-xl bg-background/60 ring-1 ring-input"
            >
              <FilePreview file={file} />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                className="absolute top-1.5 right-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 hover:text-white"
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {isFull && (
        <p className="text-xs text-muted-foreground">
          You&apos;ve added the maximum of {maxFiles} images.
        </p>
      )}

      <HiddenFileInput
        inputRef={picker.inputRef}
        accept={accept}
        multiple
        onChange={picker.handleInputChange}
      />
    </div>
  )
}
