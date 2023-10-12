import Button from "./shared/components/FormElements/Button";

export default function Home() {
  return (
    <div className="flex bg-pink h-screen items-center">
      <div className="flex flex-col w-full sm:w-2/3 md:w-1/3 pl-20">
        <div className="text-navy-blue text-6xl text-left">
          <div>ENGAGE</div>
          <div>YOUR</div>
          <div>AUDIENCES</div>
        </div>
        <Button to={"/polls"} yellow>
          create a poll
        </Button>
      </div>
    </div>
  );
}
