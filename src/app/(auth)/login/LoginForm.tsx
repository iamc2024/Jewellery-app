'use client'

import { useForm } from "react-hook-form";
import { loginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/PasswordInput";
import { useState, useTransition } from "react";
import { login } from './actions';
import LoadingButton from "@/components/LoadingButton";

const LoginForm = () => {

  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginValues) => {
    setError(undefined)
    startTransition(async () => {
      const {error} = await login(values)
      if(error) setError(error)
  })};

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && <p className="text-center text-destructive">{error}</p>}
          <FormField
            control = {form.control}
            name = 'email'
            render = {({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' type={'text'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}

          />
          <FormField
            control = {form.control}
            name = 'password'
            render = {({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton  loading={isPending} type='submit' className='w-full' >
            Login
          </LoadingButton>

        </form>
      </Form>
    </div>
  );
};

export default LoginForm;