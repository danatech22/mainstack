"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, subDays, subMonths, startOfMonth } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  transactionFilterSchema,
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
  DATE_PRESETS,
} from "../../types/filter";
import type { TransactionFilterValues } from "../../types/filter";
import { filterParsers } from "../../types/parsers";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export function FilterSheet({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [typePopoverOpen, setTypePopoverOpen] = React.useState(false);
  const [statusPopoverOpen, setStatusPopoverOpen] = React.useState(false);

  // URL state management with nuqs
  const [urlState, setUrlState] = useQueryStates(filterParsers, {
    shallow: false,
  });

  // Form setup
  const form = useForm<TransactionFilterValues>({
    resolver: zodResolver(transactionFilterSchema),
    defaultValues: {
      dateRange: {
        from: urlState.dateFrom || undefined,
        to: urlState.dateTo || undefined,
      },
      transactionType: urlState.transactionType || [],
      transactionStatus: urlState.transactionStatus || [],
      datePreset: (urlState.datePreset as any) || undefined,
    },
  });

  // Date preset handler
  const handleDatePreset = (preset: string) => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case "today":
        from = today;
        break;
      case "last7days":
        from = subDays(today, 7);
        break;
      case "thisMonth":
        from = startOfMonth(today);
        break;
      case "last3months":
        from = subMonths(today, 3);
        break;
      default:
        return;
    }

    form.setValue("dateRange.from", format(from, "yyyy-MM-dd"));
    form.setValue("dateRange.to", format(to, "yyyy-MM-dd"));
    form.setValue("datePreset", preset as any);
  };

  // Apply filters
  const onSubmit = (data: TransactionFilterValues) => {
    setUrlState({
      dateFrom: data.dateRange?.from || null,
      dateTo: data.dateRange?.to || null,
      transactionType: data.transactionType?.length
        ? data.transactionType
        : null,
      transactionStatus: data.transactionStatus?.length
        ? data.transactionStatus
        : null,
      datePreset: data.datePreset || null,
    });
    setOpen(false);
  };

  // Clear filters
  const handleClear = () => {
    form.reset({
      dateRange: { from: undefined, to: undefined },
      transactionType: [],
      transactionStatus: [],
      datePreset: undefined,
    });
    setUrlState({
      dateFrom: null,
      dateTo: null,
      transactionType: null,
      transactionStatus: null,
      datePreset: null,
    });
  };

  // Get display text for multi-select
  const getTypeDisplayText = (values: string[] | undefined) => {
    if (!values || values.length === 0) return "Store Transactions";
    if (values.length === TRANSACTION_TYPES.length) {
      return "Store Transactions, Get Tipped, Withdrawals, Chargebacks, Ca...";
    }
    const labels = values
      .map((v) => TRANSACTION_TYPES.find((t) => t.value === v)?.label)
      .filter(Boolean);
    return (
      labels.join(", ").slice(0, 50) +
      (labels.join(", ").length > 50 ? "..." : "")
    );
  };

  const getStatusDisplayText = (values: string[] | undefined) => {
    if (!values || values.length === 0) return "Successful";
    if (values.length === TRANSACTION_STATUSES.length) {
      return "Successful, Pending, Failed";
    }
    return values
      .map((v) => TRANSACTION_STATUSES.find((s) => s.value === v)?.label)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
          {/* Date Presets */}
          <Controller
            name="datePreset"
            control={form.control}
            render={({ field }) => (
              <Field>
                <ToggleGroup
                  type="single"
                  value={field.value || ""}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value);
                      handleDatePreset(value);
                    }
                  }}
                  className="grid grid-cols-4 gap-2"
                >
                  {DATE_PRESETS.map((preset) => (
                    <ToggleGroupItem
                      key={preset.value}
                      value={preset.value}
                      className="text-sm"
                    >
                      {preset.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            )}
          />

          {/* Date Range */}
          <div className="space-y-4">
            <FieldLabel>Date Range</FieldLabel>
            <div className="grid grid-cols-2 gap-4">
              {/* From Date */}
              <Controller
                name="dateRange.from"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!field.value}
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(new Date(field.value), "dd MMM yyyy")
                            : "17 Jul 2023"}
                          <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : undefined
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* To Date */}
              <Controller
                name="dateRange.to"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!field.value}
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(new Date(field.value), "dd MMM yyyy")
                            : "17 Aug 2023"}
                          <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : undefined
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>

          {/* Transaction Type - Multi-select with checkboxes */}
          <Controller
            name="transactionType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Transaction Type</FieldLabel>
                <Popover
                  open={typePopoverOpen}
                  onOpenChange={setTypePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={typePopoverOpen}
                      className={cn(
                        "w-full justify-between font-normal",
                        (field.value?.length ?? 0) === 0 &&
                          "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">
                        {getTypeDisplayText(field.value)}
                      </span>
                      {typePopoverOpen ? (
                        <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      ) : (
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="p-4 space-y-4">
                      {TRANSACTION_TYPES.map((type) => {
                        const isChecked =
                          field.value?.includes(type.value) ?? false;
                        return (
                          <div
                            key={type.value}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={`type-${type.value}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value ?? []), type.value]
                                  : (field.value ?? []).filter(
                                      (v) => v !== type.value
                                    );
                                field.onChange(newValue);
                              }}
                            />
                            <label
                              htmlFor={`type-${type.value}`}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {type.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Transaction Status - Multi-select with checkboxes */}
          <Controller
            name="transactionStatus"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Transaction Status</FieldLabel>
                <Popover
                  open={statusPopoverOpen}
                  onOpenChange={setStatusPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={statusPopoverOpen}
                      className={cn(
                        "w-full justify-between font-normal",
                        (field.value?.length ?? 0) === 0 &&
                          "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">
                        {getStatusDisplayText(field.value)}
                      </span>
                      {statusPopoverOpen ? (
                        <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      ) : (
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="p-4 space-y-4">
                      {TRANSACTION_STATUSES.map((status) => {
                        const isChecked =
                          field.value?.includes(status.value) ?? false;
                        return (
                          <div
                            key={status.value}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={`status-${status.value}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value ?? []), status.value]
                                  : (field.value ?? []).filter(
                                      (v) => v !== status.value
                                    );
                                field.onChange(newValue);
                              }}
                            />
                            <label
                              htmlFor={`status-${status.value}`}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {status.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <SheetFooter className="gap-2 sm:gap-0 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting}
            >
              Apply
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
