import React from "react";
import { Accessor, Setter, Show } from "solid-js";

type MKInputProps = {
  label: string;
  placeholder: string;
  inputSignal: Accessor<any>;
  inputSignalSetter: Setter<any>;
  type: string;
};

export default function MKInput({
  label,
  placeholder,
  inputSignal,
  inputSignalSetter,
  type,
  required = false,
}: MKInputProps & { required?: boolean }) {
  return (
    <div class="self-stretch flex flex-col justify-start items-start gap-1.5">
      <div class="justify-start text-slate-900 text-sm font-medium font-['Inter'] leading-5">
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
      </div>
      <div class="self-stretch inline-flex justify-start items-start gap-2">
        <div class="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
          <div class="self-stretch pl-3 pr-6 py-2 bg-white rounded-md outline outline-1 outline-slate-300 inline-flex justify-start items-center">
            <Show
              when={type == "textarea"}
              fallback={
                <input
                  class="outline-none justify-start text-zinc-900 text-base font-normal font-['Inter'] leading-6 w-full h-full"
                  placeholder={placeholder}
                  type={type}
                  value={inputSignal()}
                  onChange={(e) => inputSignalSetter(e.target.value)}
                  required={required}
                ></input>
              }
            >
              <textarea
                class="outline-none justify-start text-zinc-900 text-base font-normal font-['Inter'] leading-6 w-full h-full"
                placeholder={placeholder}
                value={inputSignal()}
                onChange={(e) => inputSignalSetter(e.target.value)}
                required={required}
              ></textarea>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
