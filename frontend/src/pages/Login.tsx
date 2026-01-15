import React, { useEffect ,useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Mail, Lock, Loader2 ,Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useToast } from "../hooks/use-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      if (!email || !password) {
        toast({
          title: "Missing fields",
          description: "Please fill in all fields.",
          variant: "destructive",
        });
        return;
      }
    
      setIsSubmitting(true);
    
      try {
        const success = await login(email, password);
    
        if (success) {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
    
          navigate(from, { replace: true });
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Login failed",
          description: "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal">
            <BookOpen className="h-8 w-8 text-beige" />
          </div>
          <h1 className="text-3xl font-bold text-beige">Readzy</h1>
          <p className="mt-2 text-sky-blue">Designed for how you actually read.</p>
        </div>

        <Card className="border-sky-blue/20 bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue to your library
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} autoComplete="off">
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    autoComplete="new-email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>




            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-teal text-beige"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-teal underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
