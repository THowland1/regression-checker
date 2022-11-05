import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  return (
    <>
      <input
        {...props}
        type="text"
        className={"border border-scale-7  p-4" + " " + props.className}
      />
    </>
  );
}
