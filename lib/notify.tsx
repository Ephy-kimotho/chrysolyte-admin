import toast from "react-hot-toast"

import { getErrorMessage } from "@/lib/api/errors"

function ToastMessage({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="flex w-full flex-col gap-0.5 text-left">
      <p className="font-semibold text-foreground">{title}</p>
      {detail && <p className="text-muted-foreground">{detail}</p>}
    </div>
  )
}

/** A success toast: what happened, then what it means. */
export function notifySuccess(title: string, detail?: string) {
  toast.success(<ToastMessage title={title} detail={detail} />)
}

/** An error toast: what failed, then the API's reason when it gives one. */
export function notifyError(title: string, error: unknown) {
  toast.error(
    <ToastMessage
      title={title}
      detail={getErrorMessage(error, "Something went wrong. Try again.")}
    />
  )
}
