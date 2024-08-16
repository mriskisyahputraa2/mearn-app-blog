import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsInstagram,
  BsLinkedin,
  BsGithub,
  BsFacebook,
  BsDribbble,
} from "react-icons/bs";

export default function FooterCom() {
  return (
    <>
      <Footer container className="border border-t-8 border-teal-500">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div className="mt-5">
              <Link
                to={"/"}
                className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                  Rizki's
                </span>
                Blog
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              {/* Footer About */}
              <div>
                <Footer.Title title="About" />
                <Footer.LinkGroup col>
                  <Footer.Link
                    href="https://shopping-cart-mini.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shopping Cart
                  </Footer.Link>
                  <Footer.Link href="/about" rel="noopener noreferrer">
                    Rizki's Blog
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>

              {/* Footer Follow Us */}
              <div>
                <Footer.Title title="Follow Us" />
                <Footer.LinkGroup col>
                  <Footer.Link
                    href="https://github.com/mriskisyahputraa2/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </Footer.Link>
                  <Footer.Link
                    href="https://www.linkedin.com/in/muhammad-rizki-syahputra-69a1a7272/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>

              {/* Footer Legal */}
              <div>
                <Footer.Title title="Legal" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Privacy Policy</Footer.Link>
                  <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>

          {/* Footer Divider */}
          <Footer.Divider />

          {/* Footer Copyright & Icons */}
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright
              href="#"
              by="Rizki's Blog"
              year={new Date().getFullYear()}
            />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Footer.Icon href="#" icon={BsFacebook} />
              <Footer.Icon
                href="https://www.instagram.com/mrizkisyahputraa"
                icon={BsInstagram}
              />
              <Footer.Icon
                href="https://github.com/mriskisyahputraa2"
                icon={BsGithub}
              />
              <Footer.Icon
                href="https://www.linkedin.com/in/muhammad-rizki-syahputra-69a1a7272/"
                icon={BsLinkedin}
              />
              <Footer.Icon href="#" icon={BsDribbble} />
            </div>
          </div>
        </div>
      </Footer>
    </>
  );
}
