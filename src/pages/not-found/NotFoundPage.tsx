import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NotFoundPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Card>
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            The page you requested doesn’t exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button asChild>
            <Link href="/">Go to GPA Calculator</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
