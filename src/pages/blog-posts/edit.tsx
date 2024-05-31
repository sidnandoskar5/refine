import { AutoSaveIndicator, Edit, useForm, useSelect } from "@refinedev/mantine";
import { Select, TextInput, Text, useMantineColorScheme } from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";

import { ICategory } from "../../interfaces";

export const BlogPostEdit = () => {
    const {
        saveButtonProps,
        getInputProps,
        refineCore: { queryResult, autoSaveProps },
        errors,
    } = useForm({
        initialValues: {
            title: "",
            status: "",
            category: {
                id: "",
            },
            content: "",
        },
        validate: {
            title: (value) => (value.length < 2 ? "Too short title" : null),
            status: (value) =>
                value.length <= 0 ? "Status is required" : null,
            category: {
                id: (value) =>
                    value.length <= 0 ? "Category is required" : null,
            },
            content: (value) =>
                value.length < 10 ? "Too short content" : null,
        },
        refineCoreProps: {
            autoSave: {
                enabled: true,
            },
        },
    });
    
  const { selectProps } = useSelect<ICategory>({
      resource: "categories",
      defaultValue: queryResult?.data?.data.category.id,
  });
    
    const { colorScheme } = useMantineColorScheme();

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <AutoSaveIndicator {...autoSaveProps} />
            <form>
                <TextInput
                    mt={8}
                    label="Title"
                    placeholder="Title"
                    {...getInputProps("title")}
                />
                <Select
                    mt={8}
                    label="Status"
                    placeholder="Pick one"
                    {...getInputProps("status")}
                    data={[
                        { label: "Published", value: "published" },
                        { label: "Draft", value: "draft" },
                        { label: "Rejected", value: "rejected" },
                    ]}
                />
                <Select
                    mt={8}
                    label="Category"
                    placeholder="Pick one"
                    {...getInputProps("category.id")}
                    {...selectProps}
                />
                <Text
                    mt={8}
                    weight={500}
                    size="sm"
                    color={colorScheme === "dark" ? "#C1C2C5" : "#212529"}
                >
                    Content
                </Text>
                <MDEditor
                    data-color-mode={colorScheme}
                    {...getInputProps("content")}
                />
                {errors.content && (
                    <Text mt={2} size="xs" color="red">
                        {errors.content}
                    </Text>
                )}
            </form>
        </Edit>
    );
};
