import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrivacyPolicyPDF from "./PrivacyPolicyPDF";
import toast, { Toaster } from "react-hot-toast";
import { SITE_URL } from "../Lib/site";

const PrivacyPolicy: React.FC = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDownloadClick = () => {
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12 animate-fade-in">
      <Helmet>
        <title>Privacy Policy | Ridely</title>
        <meta
          name="description"
          content="Read Ridely's privacy policy to learn how we collect, use, and protect your personal information."
        />
        <link rel="canonical" href={`${SITE_URL}/privacy-policy`} />
      </Helmet>
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#157aff]">Privacy Policy</h1>

          <div onClick={handleDownloadClick}>
            <PDFDownloadLink
              document={<PrivacyPolicyPDF />}
              fileName="ridely-privacy-policy.pdf"
              className="bg-[#157aff] text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition cursor-pointer sm:text-base text-sm font-semibold flex items-center gap-2"
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
          </div>
        </div>

        <div className="space-y-6 text-justify leading-relaxed">
          <p>
            At <strong>Ridely</strong>, your privacy is a top priority...
          </p>

          <h2 className="text-2xl font-semibold mt-4">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6">
            <li>Personal Information (name, phone number, email, etc.)</li>
            <li>Location Data (for pickup and delivery tracking)</li>
            <li>Device Information and Logs</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6">
            <li>To provide and improve our delivery services</li>
            <li>To communicate updates and support</li>
            <li>To ensure safety, security, and fraud prevention</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">3. Sharing Your Data</h2>
          <p>
            We do not sell your data. Your information may be shared with
            trusted third-party services...
          </p>

          <h2 className="text-2xl font-semibold mt-4">4. Cookies & Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance user experience
            and gather analytics.
          </p>

          <h2 className="text-2xl font-semibold mt-4">5. Your Rights</h2>
          <p>
            You can request, correct, or delete your data at any time by
            contacting us at{" "}
            <a
              href="mailto:support@ridely.app"
              className="text-[#157aff] underline"
            >
              support@ridely.app
            </a>
          </p>

          <h2 className="text-2xl font-semibold mt-4">
            6. Updates to This Policy
          </h2>
          <p>
            We may occasionally update this policy. We encourage users to review
            it regularly.
          </p>

          <h2 className="text-2xl font-semibold mt-4">7. Contact Us</h2>
          <p>
            If you have any questions or concerns, reach out to our support team
            at{" "}
            <a
              href="mailto:support@ridely.app"
              className="text-[#157aff] underline"
            >
              support@ridely.app
            </a>
            .
          </p>

          <p className="text-sm text-gray-500 mt-10">
            Last updated: May 28, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
