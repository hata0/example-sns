import { Meta, StoryObj } from "@storybook/react";
import { cn } from "@/lib/utils";

const ColorBox = ({ className }: { className: string }) => {
  return (
    <div>
      <span>{className}</span>
      <div className={cn("h-10 w-full border", className)} />
    </div>
  );
};

const BgColorsComponent = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid grid-cols-3 text-xl font-bold">
        <div>default</div>
        <div>hover</div>
        <div>focus</div>
      </div>
      <div className="grid grid-cols-3">
        <ColorBox className="bg-background" />
        <ColorBox className="bg-accent" />
        <ColorBox className="bg-background opacity-50" />
      </div>
      <div className="grid">
        <ColorBox className="bg-card" />
      </div>
      <div className="grid">
        <ColorBox className="bg-popover" />
      </div>
      <div className="grid grid-cols-3">
        <ColorBox className="bg-primary" />
        <ColorBox className="bg-primary/90" />
        <ColorBox className="bg-primary opacity-50" />
      </div>
      <div className="grid grid-cols-3">
        <ColorBox className="bg-secondary" />
        <ColorBox className="bg-secondary/80" />
        <ColorBox className="bg-secondary opacity-50" />
      </div>
      <div className="grid">
        <ColorBox className="bg-muted" />
      </div>
      <div className="grid grid-cols-3">
        <ColorBox className="bg-destructive" />
        <ColorBox className="bg-destructive/90" />
        <ColorBox className="bg-destructive opacity-50" />
      </div>
      <div className="grid">
        <ColorBox className="bg-chart-1" />
      </div>
      <div className="grid">
        <ColorBox className="bg-chart-2" />
      </div>
      <div className="grid">
        <ColorBox className="bg-chart-3" />
      </div>
      <div className="grid">
        <ColorBox className="bg-chart-4" />
      </div>
      <div className="grid">
        <ColorBox className="bg-chart-5" />
      </div>
    </div>
  );
};

type Story = StoryObj<typeof BgColorsComponent>;

export const BgColors: Story = {};

export default {
  title: "Colors",
  component: BgColorsComponent,
} satisfies Meta<typeof BgColorsComponent>;
