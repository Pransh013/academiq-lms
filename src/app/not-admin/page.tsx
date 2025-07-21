import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavbarLogo } from "@/components/ui/navbar-logo";
import Link from "next/link";

export default function NotAdminPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors">
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <NavbarLogo />
      </div>
      <Card className="w-full max-w-md mx-auto shadow-lg border border-border bg-card/80 dark:bg-card/90 animate-in fade-in zoom-in-75">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            Access Denied
          </CardTitle>
          <CardDescription>
            You do not have admin privileges to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <span className="text-6xl">🚫</span>
            <p className="text-center text-muted-foreground">
              If you believe this is a mistake, please contact your
              administrator.
              <br />
              Otherwise, you can return to the home page.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg" className="w-full">
            <Link href="/">Go to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
