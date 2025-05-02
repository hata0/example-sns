import { Meta, StoryObj } from "@storybook/react";
import { PropsWithChildren } from "react";
import { textList } from "./category-list";
import { cn } from "@/lib/utils";

const ColorBox = ({
  className,
  children,
}: PropsWithChildren<{ className: string }>) => {
  return (
    <div>
      <span>{children}</span>
      <div className="grid grid-cols-2">
        <div className={cn("h-10 w-full border bg-white", className)}>
          Sample Text
        </div>
        <div className={cn("h-10 w-full border bg-black", className)}>
          Sample Text
        </div>
      </div>
    </div>
  );
};

const TextColorsComponent = () => {
  return (
    <div className="flex flex-col gap-y-6">
      {textList.map((text) => (
        <ColorBox key={text} className={text}>
          {text}
        </ColorBox>
      ))}
    </div>
  );
};

type Story = StoryObj<typeof TextColorsComponent>;

export const TextColors: Story = {};

export default {
  title: "Colors",
  component: TextColorsComponent,
} satisfies Meta<typeof TextColorsComponent>;
