import { NextPageContext } from "next";
import React from "react";
import Link from "next/link";

interface ErrorProps {
  statusCode?: number;
}

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          {statusCode ? `Error ${statusCode}` : "Application Exception"}
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          An unexpected navigation event occurred. Please return to the portal or refresh.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Client Dashboard
          </Link>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
