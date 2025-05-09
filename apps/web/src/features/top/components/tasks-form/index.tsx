import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postPostsBody } from "@/gen/api/posts/posts.zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import { usePostPosts } from "@/gen/api/posts/posts";

export const TasksForm = () => {
  const form = useForm<z.infer<typeof postPostsBody>>({
    resolver: zodResolver(postPostsBody),
    defaultValues: {
      content: "",
    },
  });
  const createMutation = usePostPosts();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          createMutation.mutate({ data });
          form.reset();
        })}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>投稿内容</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">投稿</Button>
      </form>
    </Form>
  );
};
