import { Meta, StoryObj } from "@storybook/react";
import { bgList, textList } from "./category-list";

type Props = {
  bgColorClassname: (typeof bgList)[number];
  textColorClassname: (typeof textList)[number];
};

const TextBgColorComponent = ({
  bgColorClassname,
  textColorClassname,
}: Props) => {
  return (
    <div className={`${textColorClassname} ${bgColorClassname}`}>
      Sample Text
    </div>
  );
};

type Story = StoryObj<typeof TextBgColorComponent>;

export const TextBgColor: Story = {};

export default {
  title: "Colors",
  component: TextBgColorComponent,
  argTypes: {
    bgColorClassname: {
      options: bgList,
      control: { type: "select" },
    },
    textColorClassname: {
      options: textList,
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof TextBgColorComponent>;
