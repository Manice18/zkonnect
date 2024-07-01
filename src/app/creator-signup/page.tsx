import { constructMetaData } from "@/lib/metadata";
import CreatorSignupForm from "@/components/CreatorSignup/CreatorSignupForm";

export const metadata = constructMetaData({
  title: "Creator Sign Up | zKonnect",
  description: "This is the creator sign-up of zKonnect",
});

const SignupPage = () => {
  return (
    <section className="flex h-screen flex-col items-center pt-48">
      <div className="flex min-h-[400px] min-w-[800px] flex-col items-center space-y-8">
        <h1 className="text-center text-3xl font-bold text-black">
          Tell Us About Yourself to Begin
        </h1>
        <CreatorSignupForm />
      </div>
    </section>
  );
};

export default SignupPage;
