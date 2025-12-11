export default function ShareResource() {
  return (
    // TODO: Make a async to make a post
    // Make backend endpoint
    // Should I make an effect that will update the posts after sharing the resource?
    <div
      data-state="Default"
      data-type="default"
      class="w-48 px-4 py-2 bg-slate-900 rounded-md flex justify-center items-center gap-2.5"
    >
      <div class="justify-start text-white text-sm font-medium font-['Inter'] leading-6">
        Share Resource
      </div>
    </div>
  );
}
