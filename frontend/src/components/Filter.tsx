import { For, useContext } from "solid-js";
import { RESOURCE_TYPES } from "./ResourceSelect";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Flex } from "./ui/flex";
import { UtilityContext } from "./context/create";

export default function Filter() {
  const { setFilterType } = useContext(UtilityContext);

  const appendFilterType = (newType: string) => {
    setFilterType((current: string[]) => [...current, newType]);
  };

  const removeFilterType = (typeToRemove: string) => {
    setFilterType((current: string[]) =>
      current.filter((type) => type !== typeToRemove),
    );
  };

  return (
    <div class="w-60 h-170 p-4 bg-white rounded-2xl outline-1 outline-offset-[-1px] outline-black/10 inline-flex flex-col justify-start items-start gap-2 mr-4">
      <div class="self-stretch py-2.5 inline-flex justify-start items-start gap-2.5">
        <div class="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
          <div class="self-stretch inline-flex justify-between items-center">
            <div class="justify-start text-slate-900 text-lg font-semibold font-['Inter'] leading-7">
              Filters
            </div>
            <div class="justify-start text-slate-900 text-sm font-normal font-['Inter'] underline leading-5">
              Reset filters
            </div>
          </div>
          <div class="flex flex-col justify-start items-start gap-2.5">
            <div class="justify-start text-slate-900 text-base font-normal font-['Inter'] leading-7">
              Resource Type
            </div>
            <For each={RESOURCE_TYPES}>
              {(resType, id) => (
                <Flex class="justify-start outline-none! ring-0! ">
                  <Checkbox
                    id={id().toString()}
                    class="pr-1 outline-none! ring-0!"
                    onChange={(isChecked: boolean) => {
                      if (isChecked) {
                        appendFilterType(resType);
                      } else {
                        removeFilterType(resType);
                      }
                    }}
                  />
                  <Label> {resType} </Label>
                </Flex>
              )}
            </For>
          </div>
          <div class="self-stretch flex flex-col justify-start items-start gap-2.5">
            <div class="justify-start text-slate-900 text-base font-normal font-['Inter'] leading-7">
              Tags
            </div>
            {/* TODO Buttons that look like badges */}
          </div>
        </div>
      </div>
    </div>
  );
}
