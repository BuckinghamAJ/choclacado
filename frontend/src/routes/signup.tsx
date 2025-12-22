import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import MKInput from "~/components/ui/mk-input";
import authClient from "~/lib/auth-client";

export default function SignUp() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [name, setName] = createSignal("");

  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authClient.signUp.email({
        email: email(),
        password: password(),
        name: name(),
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      setError(`Failed to create account. Please try again. - ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="w-full h-[64rem] relative bg-neutral-50 overflow-hidden justify-center flex">
      <div class="w-[33rem] h-[9rem] left-auto top-[8.6875rem] absolute">
        <div class="w-[33rem] h-[4rem] left-0 top-[4.9375rem] absolute inline-flex flex-col justify-start items-center gap-2">
          <div class="self-stretch text-center justify-start text-slate-900 text-3xl font-semibold font-['Inter'] leading-9">
            Join Method Know
          </div>
          <div class="self-stretch text-center justify-start text-slate-900 text-xl font-normal font-['Inter'] leading-7">
            Share and discover valuable learning resources
          </div>
        </div>
        <div class="w-[4rem] h-[4rem] left-[45%] top-0 absolute bg-black rounded-full"></div>
        <div class="w-[2.25rem] h-[2.25rem] left-[47.5%]  top-[0.9375rem] absolute overflow-hidden">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 3V15L19.5 10.5L24 15V3M6 29.25V6.75C6 5.75544 6.39509 4.80161 7.09835 4.09835C7.80161 3.39509 8.75544 3 9.75 3H28.5C28.8978 3 29.2794 3.15804 29.5607 3.43934C29.842 3.72064 30 4.10218 30 4.5V31.5C30 31.8978 29.842 32.2794 29.5607 32.5607C29.2794 32.842 28.8978 33 28.5 33H9.75C8.75544 33 7.80161 32.6049 7.09835 31.9017C6.39509 31.1984 6 30.2446 6 29.25ZM6 29.25C6 28.2554 6.39509 27.3016 7.09835 26.5983C7.80161 25.8951 8.75544 25.5 9.75 25.5H30"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div class="w-120 p-4 left-auto top-79.5 absolute bg-white rounded-2xl outline-1 -outline-offset-1 outline-black/10 inline-flex flex-col justify-start items-start gap-2">
        <div class="py-2.5 inline-flex justify-center items-center gap-2.5">
          <div class="justify-start text-slate-900 text-lg font-normal font-['Inter'] leading-7">
            Create Account
          </div>
        </div>
        <div class="self-stretch flex flex-col justify-start items-start gap-4">
          <MKInput
            inputSignal={name}
            inputSignalSetter={setName}
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
          ></MKInput>
          <MKInput
            inputSignal={email}
            inputSignalSetter={setEmail}
            label="Email"
            placeholder="Enter your email"
            type="text"
          ></MKInput>
          <MKInput
            inputSignal={password}
            inputSignalSetter={setPassword}
            label="Password"
            placeholder="Enter your password"
            type="password"
          ></MKInput>
          <div
            data-state="Default"
            data-type="default"
            class="self-stretch px-4 py-2 bg-slate-900 rounded-md inline-flex justify-center items-center gap-2.5"
          >
            <Button
              class="justify-start text-white text-sm font-medium font-['Inter'] leading-6"
              disabled={loading()}
              onClick={handleSubmit}
            >
              {loading() ? "Creating Account..." : "Sign Up"}
            </Button>
            {error() && (
              <div class="text-red-400 text-sm text-center">{error()}</div>
            )}
          </div>
        </div>
        <div class="self-stretch inline-flex justify-center items-start gap-2">
          <div class="justify-start text-slate-900 text-base font-normal font-['Inter'] leading-7">
            Already have an account?{" "}
          </div>
          <div class="justify-start text-slate-900 text-base font-normal font-['Inter'] underline leading-7">
            <A href="/login" class="underline">
              Login
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}
