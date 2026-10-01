"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GovernmentLogo } from "@/components/branding/GovernmentLogo";

export default function NoticePrintPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (data && !loading) {
      // Small delay to ensure images render
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [data, loading]);

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Generating Document...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center text-red-500">Notice data not found.</div>;
  }

  const isDps = data.targetType === "DPS";
  const targetEntity = isDps ? data.dpsOfficer : data.office;
  
  const officerName = isDps ? targetEntity.name : "Nodal Officer";
  const designation = isDps ? targetEntity.designation : "Head of Office";
  const departmentName = isDps ? targetEntity.office?.department?.name : targetEntity.department?.name;
  const officeName = isDps ? targetEntity.office?.name : targetEntity.name;
  const districtName = isDps ? targetEntity.office?.district?.name : targetEntity.district?.name;
  const targetCode = isDps ? targetEntity.employeeCode : targetEntity.code;

  return (
    <div className="bg-white min-h-screen text-black max-w-4xl mx-auto p-12 font-serif" style={{ backgroundColor: 'white' }}>
      {/* Header */}
      <div className="flex flex-col items-center border-b-2 border-slate-800 pb-6 mb-8">
        <div className="mb-4">
          <GovernmentLogo variant="standalone" />
        </div>
        <h1 className="text-xl font-bold uppercase tracking-wider text-center">Government of Assam</h1>
        <h2 className="text-lg font-semibold text-center mt-1">Administrative Reforms and Training Department</h2>
        <h3 className="text-base font-medium text-center mt-1">Disciplinary Review Authority</h3>
      </div>

      {/* Meta */}
      <div className="flex justify-between items-start mb-8 text-sm">
        <div>
          <p><strong>Notice No:</strong> {data.caseRef}</p>
          <p><strong>File Ref:</strong> {data.caseRef}/ART/{new Date().getFullYear()}</p>
        </div>
        <div className="text-right">
          <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p><strong>Priority:</strong> {data.priority}</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold uppercase underline underline-offset-4 tracking-wide">
          Show-Cause Notice
        </h2>
        <p className="mt-2 text-sm italic">
          Issued under Section 7(1) of the Assam Right to Public Services Act, 2012
        </p>
      </div>

      <div className="mb-8 text-base leading-relaxed space-y-4">
        <p><strong>To,</strong></p>
        <div className="pl-6 border-l-2 border-slate-300">
          <p className="font-bold">{officerName}</p>
          <p>{designation}</p>
          <p>{officeName}, {districtName}</p>
          <p>{departmentName}</p>
          <p>Code: {targetCode}</p>
        </div>
      </div>

      <div className="space-y-6 text-base leading-relaxed text-justify">
        <p>
          <strong>Sub:</strong> Notice for statutory delay in delivering public services and failure to adhere to the mandated Service Level Agreement (SLA) timelines under the Assam RTPS Act, 2012.
        </p>

        <p>
          Whereas, the Right to Public Services Act, 2012 mandates the timely delivery of notified services to the citizens of Assam by the Designated Public Servant (DPS) within the stipulated statutory time limit.
        </p>

        <p>
          Whereas, upon routine administrative review of the Sewa Setu and RTPS Dashboard on <strong>{new Date().toLocaleDateString('en-IN')}</strong>, it has come to the notice of the undersigned that there has been a systematic failure in service delivery attributed to your office/designation. The primary issue flagged is:
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200">
          <p className="font-semibold italic">"{data.primaryIssue}"</p>
        </div>

        <p>
          Specific evidence of SLA breaches has been recorded. Below is the list of identified application(s) that have exceeded their statutory timeline:
        </p>

        <table className="w-full text-sm border-collapse border border-slate-800 my-4">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-800 p-2 text-left">RTPS Ref No</th>
              <th className="border border-slate-800 p-2 text-left">Service</th>
              <th className="border border-slate-800 p-2 text-left">Target SLA Date</th>
              <th className="border border-slate-800 p-2 text-left">Days Taken/Overdue</th>
            </tr>
          </thead>
          <tbody>
            {data.evidenceList.map((ev: any) => (
              <tr key={ev.id}>
                <td className="border border-slate-800 p-2 font-mono">{ev.application?.rtpsRefNo}</td>
                <td className="border border-slate-800 p-2">{ev.application?.service?.name}</td>
                <td className="border border-slate-800 p-2">{new Date(ev.application?.targetSlaDate).toLocaleDateString()}</td>
                <td className="border border-slate-800 p-2 text-red-600 font-bold">{ev.application?.daysTaken} days</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          You are hereby directed to <strong>show cause</strong> as to why disciplinary action should not be initiated against you under the provisions of the Assam RTPS Act, 2012 and relevant conduct rules, for dereliction of duty resulting in denial/delay of public services.
        </p>

        <p>
          Your written explanation must reach this authority via the RTPS Compliance Portal no later than <strong>7 calendar days</strong> from the date of this notice. Failing to respond within the stipulated time will result in ex-parte proceedings and immediate imposition of penalties as per the Act.
        </p>
      </div>

      <div className="mt-16 flex justify-end">
        <div className="text-center">
          <div className="w-48 h-20 mb-2 flex items-center justify-center">
            {/* Placeholder for Signature */}
            <span className="text-slate-300 italic">Digitally Signed</span>
          </div>
          <p className="font-bold border-t border-slate-800 pt-2">Competent Authority</p>
          <p>Disciplinary Review Board</p>
          <p>Government of Assam</p>
        </div>
      </div>

      <div className="mt-16 text-xs text-slate-500 text-center border-t border-slate-200 pt-4">
        <p>This is a system-generated notice from the Assam RTPS Executive Monitoring Dashboard.</p>
        <p>To verify the authenticity of this document, reference Case ID: {data.caseRef}</p>
      </div>

      {/* Hide print UI elements in actual print using CSS media queries in global css, 
          but Tailwind print: classes are excellent here */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: white !important; }
          .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
}
