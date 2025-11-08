import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          General Terms and Conditions
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Introduction
            </h2>
            <p>
              These website Standard terms and Conditions written on this
              webpage shall manage your use of our website, accessible at
              www.nabeelbus.com These terms will be applied fully and effect to your
              use of this website. By using this website, you agreed to accept
              all terms and conditions written in here. You must not use this
              website if you disagree with any of these website standard terms
              and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Intellectual Property Rights
            </h2>
            <p>
              Other than the content you own, under these terms, the operator
              and/or its licensors own all the intellectual property rights and
              materials contained in this website.
            </p>
            <p>
              You are granted limited license only for purposes of viewing the
              material contained on this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Restrictions
            </h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                Publishing any website material in any other media selling,
                sublicensing and/or otherwise commercializing any website
                material.
              </li>
              <li>
                Publicly performing and/or showing any website material using
                this website in any way that is or may be damaging to this
                website.
              </li>
              <li>Using this website in any way that impacts user access to this website</li>
              <li>
                If any provision of these terms is found to be invalid under any
                applicable law, such provisions shall be deleted without
                affecting the remaining provisions herein. Using this website
                contrary to applicable laws and regulations, or in any way may
                cause harm to the website, or to any person or business entity
              </li>
              <li>
                Engaging in any data mining, data harvesting, data extracting or
                any other similar activity in relation to this website
              </li>
              <li>
                Using this website to engage in any advertising or marketing
                certain areas of this website are restricted from being accessed
                by you, and the operator may further restrict access by you to
                any areas of this website, at any time, in absolute discretion.
                Any user ID and password you may have for this website are
                confidential and you must maintain confidentiality as well.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Warranties
            </h2>
            <p>
              This website is provided "as is," with all faults, and the
              operator expresses no representations or warranties, of any kind
              related to this website or the materials contained on this
              website. Also, nothing contained on this website shall be
              interpreted as advising you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Limitation of Liability
            </h2>
            <p>
              In no event shall the operator, nor any of its officers, directors
              and employees, shall be held liable for anything arising out of or
              in any way connected with your use of this website whether such
              liability is under contract. The operator, including its officers,
              directors and employees shall not be held liable for any indirect,
              consequential or special liability arising out of or in any way
              related to your use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Indemnification
            </h2>
            <p>
              You hereby indemnify to the fullest extent the operator from and
              against any and/or all liabilities, costs, demands, causes of
              action, damages and expenses arising in any way related to your
              breach of any of the provisions of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Severability
            </h2>
            <p>
              If any provision of these terms is found to be invalid under any
              applicable law, such provisions shall be deleted without affecting
              the remaining provisions herein.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Variation of Terms
            </h2>
            <p>
              The operator is permitted to revise these terms at any time as it
              sees fit, and by using this website you are expected to review
              these terms on a regular basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Assignment
            </h2>
            <p>
              The operator is allowed to assign, transfer, and subcontract its
              rights and/or obligations under these terms without any
              notification. However, you are not allowed to assign, transfer, or
              subcontract any of your rights and/or obligations under these
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Entire Agreement
            </h2>
            <p>
              These terms constitute the entire agreement between the operator
              and you in relation to your use of this website, and supersede all
              prior agreements and understandings.
            </p>
          </section>
        </div>

        {/* Cancellation Policy */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Cancellation Policy
          </h1>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>
              Between 0 Hrs to 12 Hrs from the main station departure time 100%
              Cancellation Charges
            </li>
            <li>
              Between 12 Hrs to 24 Hrs from the main station departure time 50%
              Cancellation Charges
            </li>
            <li>
              Between 1 Hrs to 2 Hrs from the main station departure time 25%
              Cancellation Charges
            </li>
            <li>
              Between 2 Hrs to 3 Hrs from the main station departure time 25%
              Cancellation Charges
            </li>
            <li>
              Between 3 to 30 days before main station departure time 25%
              Cancellation Charges
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
