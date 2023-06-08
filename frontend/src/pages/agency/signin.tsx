import ScreenWrapper from "@/components/ScreenWrapper";
import Router from "next/router";
import { FormEvent } from "react";

const Signin = () => {

  const signin = (e:FormEvent) => {
    e.preventDefault();
    Router.push("/agency/:name");
  };

  return (
    <ScreenWrapper>
      <form onSubmit={signin} className="flex flex-col items-center animate-height-agency-form overflow-hidden">
        <img src="/assets/imageplaceholder.svg" alt="placeholder image" className="h-24 mb-2" />

        <label htmlFor="profile" className="w-[100px] btn-primary py-1 rounded-md text-sm cursor-pointer">Upload</label>
        <input type="file" id="profile" hidden />
        <fieldset className="mt-6">
          <legend className="ml-3 translate-y-2 bg-bgColor px-1">Primary Language</legend>
          <select defaultValue={"English"} className="w-[300px] h-10 outline-none border-[1px] border-black pl-2 bg-bgColor">
            <option value="French">FRENCH</option>
            <option value="English">ENGLISH</option>
            <option value="Spanish">SPANISH</option>
          </select>
        </fieldset>
        
        <button type="submit" className="btn-primary h-10 w-[300px] mt-8">Submit</button>
      </form>
    </ScreenWrapper>
  );
};

export default Signin;