// FormDialog.tsx
import React from "react";
import {
  Control,
  DefaultValues,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "tel"
  | "url"
  | "date"
  | "datetime-local"
  | "time"
  | "select"
  | "multiselect"
  | "textarea"
  | "file";

export interface SelectOption {
  label: string;
  value: string | number;
  selected?: boolean;
}

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: SelectOption[];
  validation?: z.ZodTypeAny;
  gridCols?: number;
  min?: number | string;
  max?: number | string;
  rows?: number;
  accept?: string;
  defaultValue?: any;
}

const MultiSelect = React.forwardRef<
  HTMLDivElement,
  {
    value: number[];
    onChange: (value: number[]) => void;
    options: SelectOption[];
    placeholder?: string;
  }
>(({ value = [], onChange, options, placeholder }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (optionValue: string | number) => {
    const numValue = Number(optionValue);
    const newValue = value.includes(numValue)
      ? value.filter((v) => v !== numValue)
      : [...value, numValue];
    onChange(newValue);
  };

  const getSelectedLabels = () => {
    return value
      .map((v) => options.find((opt) => opt.value === v)?.label)
      .filter(Boolean);
  };

  return (
    <div ref={ref} className="relative">
      <div
        className="border border-gray-300 rounded-md p-2 min-h-[40px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {getSelectedLabels().map((label, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(value[index]);
                }}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {value.length === 0 && (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                value.includes(Number(option.value)) ? "bg-gray-50" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

MultiSelect.displayName = "MultiSelect";

interface FormDialogProps<T extends FieldValues> {
  mode: "add" | "edit";
  title: string;
  fields: FormField<T>[];
  data?: Partial<T>;
  onSave: (data: T) => void;
  trigger?: React.ReactNode;
}

export function FormDialog<T extends FieldValues>({
  mode,
  title,
  fields,
  data,
  onSave,
  trigger,
}: FormDialogProps<T>) {
  const [open, setOpen] = React.useState(false);

  const schema = React.useMemo(() => {
    const schemaFields = fields.reduce((acc, field) => {
      if (field.type === "file") {
        acc[field.name] = field.validation || z.any().optional();
      } else if (field.type === "multiselect") {
        acc[field.name] = field.validation || z.array(z.number()).optional();
      } else {
        acc[field.name] = field.validation || z.string().optional();
      }
      return acc;
    }, {} as { [key: string]: z.ZodTypeAny });

    return z.object(schemaFields);
  }, [fields]);

  const defaultValues = React.useMemo(() => {
    return fields.reduce((acc, field) => {
      let defaultValue;

      if (field.type === "select") {
        const selectedOption = field.options?.find((opt) => opt.selected);
        defaultValue =
          data?.[field.name] ||
          (selectedOption ? String(selectedOption.value) : "") ||
          field.defaultValue ||
          "";
      } else if (field.type === "multiselect") {
        defaultValue = data?.[field.name] || [];
      } else {
        defaultValue = data?.[field.name] || field.defaultValue || "";
      }

      return {
        ...acc,
        [field.name]: defaultValue,
      };
    }, {}) as DefaultValues<T>;
  }, [fields, data]);

  const form = useForm<T>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  React.useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  const onSubmit = async (formData: T) => {
    try {
      const validatedData = schema.parse(formData);
      onSave({ ...data, ...validatedData } as T);
      setOpen(false);
      form.reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, curr) => {
          const path = curr.path.join(".");
          acc[path] = curr.message;
          return acc;
        }, {} as Record<string, string>);

        Object.keys(errors).forEach((path) => {
          form.setError(path as Path<T>, {
            type: "manual",
            message: errors[path],
          });
        });
      }
    }
  };

  const renderFormControl = (field: FormField<T>, formField: any) => {
    switch (field.type) {
      case "multiselect":
        return (
          <MultiSelect
            value={formField.value || []}
            onChange={formField.onChange}
            options={field.options || []}
            placeholder={field.placeholder}
          />
        );
      case "file":
        return (
          <Input
            type="file"
            accept={field.accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              formField.onChange(file);
            }}
            className="border-gray-300"
          />
        );
      case "select":
        return (
          <Select
            onValueChange={formField.onChange}
            value={formField.value}
            defaultValue={formField.value}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            {...formField}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className="border-gray-300"
          />
        );
      default:
        return (
          <Input
            {...formField}
            type={field.type}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className="border-gray-300"
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={mode === "add" ? "default" : "ghost"}
            size={mode === "add" ? "sm" : "icon"}
            className={mode === "add" ? "bg-blue-900 hover:bg-blue-800" : ""}
          >
            {mode === "add" ? (
              <>
                <Plus className="w-4 h-4 text-white" />
                Add {title}
              </>
            ) : (
              <Edit2 className="w-4 h-4 text-gray-700" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900 flex gap-2">
            <div className="h-5 w-1 bg-blue-900 rounded-full" />

            {mode === "add" ? `Add New ${title}` : `Edit ${title}`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control as Control<T>}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem
                      className={
                        field.gridCols ? `md:col-span-${field.gridCols}` : ""
                      }
                    >
                      <FormLabel className="text-gray-700">
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        {renderFormControl(field, formField)}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-900 w-full sm:w-auto"
              >
                {mode === "add" ? `Add ${title}` : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
