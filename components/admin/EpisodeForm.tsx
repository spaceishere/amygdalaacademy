"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EpisodeSchema } from "@/lib/schemas";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createEpisode, updateEpisode } from "@/actions/episodes";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type EpisodeFormProps = {
  courseId: string;
  episode?: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    isFreePreview: boolean;
    videoUrl: string | null;
    thumbnailUrl: string | null;
  };
  onSuccess: () => void;
};

export function EpisodeForm({
  courseId,
  episode,
  onSuccess,
}: EpisodeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);

  const form = useForm<z.infer<typeof EpisodeSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(EpisodeSchema) as any,
    defaultValues: {
      title: episode?.title || "",
      description: episode?.description || "",
      order: episode?.order || 0,
      isFreePreview: episode?.isFreePreview || false,
      videoUrl: episode?.videoUrl || undefined,
      thumbnailUrl: episode?.thumbnailUrl || undefined,
    },
  });

  // Update form if episode changes (e.g. reused component)
  useEffect(() => {
    if (episode) {
      form.reset({
        title: episode.title,
        description: episode.description || "",
        order: episode.order,
        isFreePreview: episode.isFreePreview,
        videoUrl: episode.videoUrl || undefined,
        thumbnailUrl: episode.thumbnailUrl || undefined,
      });
    }
  }, [episode, form]);

  async function onSubmit(values: z.infer<typeof EpisodeSchema>) {
    setIsLoading(true);
    try {
      if (episode) {
        await updateEpisode(episode.id, values);
      } else {
        await createEpisode(courseId, values);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.url) {
            form.setValue("videoUrl", data.url);
          }
          setUploadProgress(100);
        }
      });

      xhr.addEventListener("error", () => {
        console.error("Upload failed");
        setUploadProgress(0);
      });

      xhr.open("POST", "/api/upload");
      xhr.send(formData);

      await new Promise((resolve, reject) => {
        xhr.addEventListener("load", resolve);
        xhr.addEventListener("error", reject);
      });
    } catch {
      console.error("Upload failed");
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    setThumbnailProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setThumbnailProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.url) {
            form.setValue("thumbnailUrl", data.url);
          }
          setThumbnailProgress(100);
        }
      });

      xhr.addEventListener("error", () => {
        console.error("Upload failed");
        setThumbnailProgress(0);
      });

      xhr.open("POST", "/api/upload");
      xhr.send(formData);

      await new Promise((resolve, reject) => {
        xhr.addEventListener("load", resolve);
        xhr.addEventListener("error", reject);
      });
    } catch {
      console.error("Upload failed");
      setThumbnailProgress(0);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Гарчиг</FormLabel>
              <FormControl>
                <Input placeholder="Epsoideын гарчиг" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тайлбар</FormLabel>
              <FormControl>
                <Textarea placeholder="Epsoideын тайлбар" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дараалал (эрэмбэ)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Видео файл
          </label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            disabled={isLoading}
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-1">
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground">
                {uploadProgress}% – Видео байршуулж байна...
              </p>
            </div>
          )}
          {form.getValues("videoUrl") && uploadProgress === 100 && (
            <p className="text-sm text-green-600 truncate">
              ✓ Видео амжилттай байршуулсан
            </p>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Thumbnail зураг
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            disabled={isLoading}
          />
          {thumbnailProgress > 0 && thumbnailProgress < 100 && (
            <div className="space-y-1">
              <Progress value={thumbnailProgress} />
              <p className="text-sm text-muted-foreground">
                {thumbnailProgress}% – Зураг байршуулж байна...
              </p>
            </div>
          )}
          {form.getValues("thumbnailUrl") && thumbnailProgress === 100 && (
            <p className="text-sm text-green-600 truncate">
              ✓ Зураг амжилттай байршуулсан
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="isFreePreview"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Үнэгүй урьдчилсан харагдац</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {episode ? "Epsoide шинэчлэх" : "Epsoide үүсгэх"}
        </Button>
      </form>
    </Form>
  );
}
