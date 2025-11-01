"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, subDays, subMonths, startOfMonth, isSameDay } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import {
  transactionFilterSchema,
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
  DATE_PRESETS,
} from "../../types/filter";
import type { TransactionFilterValues } from "../../types/filter";
import { cn } from "@/lib/utils";
import { useTransactionFilters } from "@/hooks/use-filter";

interface Props {
  children: React.ReactNode;
}

export function FilterSheet({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [typePopoverOpen, setTypePopoverOpen] = React.useState(false);
  const [statusPopoverOpen, setStatusPopoverOpen] = React.useState(false);
  const { filters, setFilters, clearFilters } = useTransactionFilters();

  // Form setup
  const form = useForm<TransactionFilterValues>({
    resolver: zodResolver(transactionFilterSchema),
    defaultValues: {
      dateRange: {
        from: filters.dateFrom || undefined,
        to: filters.dateTo || undefined,
      },
      transactionType: filters.transactionType || [],
      transactionStatus: filters.transactionStatus || [],
      datePreset: (filters.datePreset as any) || undefined,
    },
  });

  // Check if dates match a preset
  const getMatchingPreset = (
    from?: string,
    to?: string
  ): string | undefined => {
    if (!from || !to) return undefined;

    const today = new Date();
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Check each preset
    for (const preset of DATE_PRESETS) {
      let presetFrom: Date;
      let presetTo: Date = today;

      switch (preset.value) {
        case "today":
          presetFrom = today;
          break;
        case "last7days":
          presetFrom = subDays(today, 7);
          break;
        case "thisMonth":
          presetFrom = startOfMonth(today);
          break;
        case "last3months":
          presetFrom = subMonths(today, 3);
          break;
        default:
          continue;
      }

      // Compare dates (ignoring time)
      if (isSameDay(fromDate, presetFrom) && isSameDay(toDate, presetTo)) {
        return preset.value;
      }
    }

    return undefined;
  };

  // Date preset handler
  const handleDatePreset = (preset: string | undefined) => {
    if (!preset) {
      // Clear dates when preset is cleared
      form.setValue("dateRange.from", undefined);
      form.setValue("dateRange.to", undefined);
      form.setValue("datePreset", undefined);
      return;
    }

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

    const fromFormatted = format(from, "yyyy-MM-dd");
    const toFormatted = format(to, "yyyy-MM-dd");

    form.setValue("dateRange.from", fromFormatted);
    form.setValue("dateRange.to", toFormatted);
    form.setValue("datePreset", preset as any);
  };

  // Handle manual date changes - auto-detect preset or clear it
  const handleDateChange = (type: "from" | "to", date: string | undefined) => {
    if (type === "from") {
      form.setValue("dateRange.from", date);
    } else {
      form.setValue("dateRange.to", date);
    }

    // Auto-detect matching preset
    const fromValue = type === "from" ? date : form.getValues("dateRange.from");
    const toValue = type === "to" ? date : form.getValues("dateRange.to");

    const matchingPreset = getMatchingPreset(fromValue, toValue);
    form.setValue("datePreset", matchingPreset as any);
  };

  // Apply filters
  const onSubmit = (data: TransactionFilterValues) => {
    setFilters({
      dateFrom: data.dateRange?.from || null,
      dateTo: data.dateRange?.to || null,
      transactionType: data.transactionType?.length
        ? data.transactionType
        : null,
      transactionStatus: data.transactionStatus?.length
        ? data.transactionStatus
        : null,
      datePreset: null,
    });

    // Close everything in sequence
    setTypePopoverOpen(false);
    setStatusPopoverOpen(false);
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
    clearFilters();
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

  // Check if any filters are applied
  const hasFilters = () => {
    const formData = form.watch(); // Use watch to make it reactive
    const hasDateRange = Boolean(
      formData.dateRange?.from && formData.dateRange?.to
    );
    const hasTransactionType =
      formData.transactionType && formData.transactionType.length > 0;
    const hasTransactionStatus =
      formData.transactionStatus && formData.transactionStatus.length > 0;

    return hasDateRange || hasTransactionType || hasTransactionStatus;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full mt-5 mr-5 rounded-3xl h-[95%] sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold tracking-tighter">
            Filter
          </SheetTitle>
        </SheetHeader>

        <form
          id="filter-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-5"
        >
          <div className="space-y-4">
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
                      if (value === field.value || value === "") {
                        handleDatePreset(undefined);
                      } else if (value) {
                        handleDatePreset(value);
                      }
                    }}
                    className="grid grid-cols-4 gap-2 w-full"
                  >
                    {DATE_PRESETS.map((preset) => (
                      <ToggleGroupItem
                        key={preset.value}
                        value={preset.value}
                        className="text-xs sm:text-sm font-semibold tracking-tighter text-[#131316] border border-gray-200 rounded-full!"
                      >
                        {preset.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
              )}
            />

            {/* Date Range Pickers */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <FieldLabel className="col-span-full text-[#131316] tracking-tighter font-semibold">
                Date Range
              </FieldLabel>
              {/* From Date */}
              <Controller
                name="dateRange.from"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="secondary"
                          data-empty={!field.value}
                          className={cn(
                            "w-full justify-between text-left font-normal text-sm tracking-tighter text-[#131316] h-12 bg-[#EFF1F6]",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(new Date(field.value), "dd MMM yyyy")
                            : "Pick date"}
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
                            handleDateChange(
                              "from",
                              date ? format(date, "yyyy-MM-dd") : undefined
                            )
                          }
                          defaultMonth={
                            field.value ? new Date(field.value) : new Date()
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
                            "w-full justify-between text-left font-normal text-sm tracking-tighter text-[#131316] h-12 bg-[#EFF1F6]",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(new Date(field.value), "dd MMM yyyy")
                            : "Pick date"}
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
                            handleDateChange(
                              "to",
                              date ? format(date, "yyyy-MM-dd") : undefined
                            )
                          }
                          defaultMonth={
                            field.value ? new Date(field.value) : new Date()
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
                      variant="secondary"
                      role="combobox"
                      aria-expanded={typePopoverOpen}
                      className={cn(
                        "w-full justify-between text-left font-normal text-sm tracking-tighter text-[#131316] h-12 bg-[#EFF1F6]",
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
                  <PopoverContent
                    className="w-full p-0 [&]:animate-none [&]:transition-none"
                    align="start"
                  >
                    <div className="p-4 space-y-6 w-116">
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
                              className="text-base font-semibold tracking-tighter text-[#131316] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                      variant="secondary"
                      role="combobox"
                      aria-expanded={statusPopoverOpen}
                      className={cn(
                        "w-full justify-between text-left font-normal text-sm tracking-tighter text-[#131316] h-12 bg-[#EFF1F6]",
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
                  <PopoverContent
                    className="w-full p-0 [&]:animate-none [&]:transition-none"
                    align="start"
                  >
                    <div className="p-4 space-y-6 w-116">
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
                              className="text-base font-semibold tracking-tighter text-[#131316] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
        </form>
        <SheetFooter className="gap-2 sm:gap-0 pt-6 w-full">
          <div className="flex gap-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="flex-1 rounded-full h-12 text-base font-semibold tracking-tighter"
            >
              Clear
            </Button>
            <Button
              type="submit"
              form="filter-form"
              className="flex-1 rounded-full h-12 disabled:bg-[#DBDEE5] text-base font-semibold tracking-tighter"
              disabled={form.formState.isSubmitting || !hasFilters()}
            >
              Apply
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
