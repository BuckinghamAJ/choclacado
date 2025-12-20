import { Accessor, Setter } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const RESOURCE_MAPPING = {
  Articles: 1,
  "Code Snippets": 2,
  "Learning Resources": 3,
} as const; // TODO: Since a quick project this is quick way to do it.

const RESOURCE_TYPES = Object.keys(RESOURCE_MAPPING) as Array<
  keyof typeof RESOURCE_MAPPING
>;

export function getResourceId(key: string): number {
  return RESOURCE_MAPPING[key as keyof typeof RESOURCE_MAPPING];
}

type ResourceSelectProps = {
  resource: Accessor<string>;
  setResource: Setter<string>;
};

export default function ResourceSelect({
  resource,
  setResource,
}: ResourceSelectProps) {
  return (
    <Select
      class="w-full text-black"
      value={resource()}
      onChange={setResource}
      options={RESOURCE_TYPES}
      placeholder="Select Resource Type"
      required={true}
      disallowEmptySelection={true}
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger aria-label="Resource type" class="w-full">
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}
