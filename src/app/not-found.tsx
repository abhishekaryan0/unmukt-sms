import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-6 shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Page Not Found (404)</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button size="sm" className="bg-slate-900 text-white gap-1.5 text-xs">
              <Home className="w-3.5 h-3.5" />
              <span>Go to Platform Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
