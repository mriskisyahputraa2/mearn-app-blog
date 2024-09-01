import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <>
      <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col">
          <h2 className="text-2xl">Want to learn more about Javascript?</h2>

          <p className="text-gray-500 my-2">
            Chekcout these resources with 100 Javascript Projects
          </p>

          <Button
            gradientDuoTone="purpleToPink"
            className="rounded-tl-xl rounded-bl-none"
          >
            <a
              href="https://web-travel-weld.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              100 Javascript Project
            </a>
          </Button>
        </div>

        <div className="p-7 flex-1">
          <img
            src="https://it.telkomuniversity.ac.id/wp-content/uploads/2023/01/Javascript-adalah-1.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
