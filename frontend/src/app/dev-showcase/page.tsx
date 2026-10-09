"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Sparkles,
  Plane,
  ChevronRight,
  ShieldCheck,
  Package,
  Layers,
  Settings,
  AlertCircle,
  CheckCircle2,
  Bell,
  Search,
  ShoppingCart,
  Menu,
} from "lucide-react";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Validation schema
import { addressSchema, type AddressFormValues } from "@/lib/validations";

export default function DevShowcasePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toggleState, setToggleState] = useState(true);

  // Form setup using React Hook Form & Zod
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "NSW",
      postalCode: "",
      country: "Australia",
      isDefault: false,
    },
  });

  const onSubmit = (data: AddressFormValues) => {
    toast.success("Validation passed!", {
      description: `Validated address for ${data.fullName} in ${data.city}, ${data.state}`,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-gray-200/80 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-[#0071e3]/10 text-[#0071e3] rounded-xl">
                <Sparkles className="w-5 h-5" />
              </span>
              <Badge variant="outline" className="text-[#0071e3] border-[#0071e3]/30 font-medium">
                Next.js UI/UX Toolkit Active
              </Badge>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Tailwind CSS v4
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#121212]">
              Component & UI/UX Design System Showcase
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Inspection and validation suite for shadcn/ui primitives, Motion animations, Zod validation, and D1 Store styling.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" className="rounded-xl cursor-pointer">
                Return to Store
              </Button>
            </Link>
            <Button
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl shadow-xs cursor-pointer"
              onClick={() =>
                toast.success("Design system test successful", {
                  description: "Sonner toast notification working with richColors.",
                })
              }
            >
              <Bell className="w-4 h-4 mr-2" />
              Test Notification
            </Button>
          </div>
        </motion.div>

        {/* Breadcrumb demo */}
        <div className="px-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/account">Developer</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>UI/UX Showcase</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Tabbed Component Explorer */}
        <Tabs defaultValue="components" className="space-y-8">
          <TabsList className="bg-white border border-gray-200 rounded-2xl p-1 shadow-2xs">
            <TabsTrigger value="components" className="rounded-xl px-5 cursor-pointer">
              Core Components
            </TabsTrigger>
            <TabsTrigger value="forms" className="rounded-xl px-5 cursor-pointer">
              Forms & Zod Validation
            </TabsTrigger>
            <TabsTrigger value="overlays" className="rounded-xl px-5 cursor-pointer">
              Modals & Overlays
            </TabsTrigger>
            <TabsTrigger value="data" className="rounded-xl px-5 cursor-pointer">
              Data & Navigation
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CORE COMPONENTS */}
          <TabsContent value="components" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Button Variants */}
              <Card className="rounded-2xl border-gray-200/80 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Buttons & Badges</CardTitle>
                  <CardDescription>Official shadcn button variants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl cursor-pointer">
                      Primary
                    </Button>
                    <Button variant="secondary" className="rounded-xl cursor-pointer">
                      Secondary
                    </Button>
                    <Button variant="outline" className="rounded-xl cursor-pointer">
                      Outline
                    </Button>
                    <Button variant="destructive" className="rounded-xl cursor-pointer">
                      Destructive
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Avatars & Feedback */}
              <Card className="rounded-2xl border-gray-200/80 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Avatars & Skeletons</CardTitle>
                  <CardDescription>User representation and loading states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                      <AvatarFallback>DJI</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">D1 Store Customer</p>
                      <p className="text-xs text-gray-500">verified@d1store.com.au</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>

              {/* Tooltip & Popover */}
              <Card className="rounded-2xl border-gray-200/80 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Tooltips & Popovers</CardTitle>
                  <CardDescription>Hover and click contextual helpers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TooltipProvider>
                    <div className="flex items-center gap-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" className="rounded-xl cursor-pointer">
                            Hover Me
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>DJI Care Refresh 2-Year Plan</p>
                        </TooltipContent>
                      </Tooltip>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="rounded-xl cursor-pointer">
                            Popover Menu
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 rounded-xl p-4">
                          <h4 className="font-semibold text-sm mb-1">D1 Store Guarantee</h4>
                          <p className="text-xs text-gray-500">
                            100% Australian Stock with full local warranty and express shipping.
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipProvider>

                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="demo-toggle" className="text-sm font-medium">
                      Marketing Updates
                    </Label>
                    <Switch
                      id="demo-toggle"
                      checked={toggleState}
                      onCheckedChange={setToggleState}
                      className="cursor-pointer"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Accordion Demo */}
            <Card className="rounded-2xl border-gray-200/80 shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Accordion / FAQ Component</CardTitle>
                <CardDescription>Collapsible content panels with smooth transitions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      Is this genuine Australian DJI stock?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      Yes. As Australia&apos;s leading DJI Authorised Retailer, all products are 100% genuine Australian stock covered by official local warranty.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      How long does shipping take?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      Orders placed before 2 PM AEST dispatch same business day with express courier options nationwide.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: FORMS & VALIDATION */}
          <TabsContent value="forms" className="space-y-8">
            <Card className="rounded-2xl border-gray-200/80 shadow-2xs max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Shipping Address Validation</CardTitle>
                <CardDescription>
                  Live form powered by <code>react-hook-form</code> and <code>zod</code> schema validation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className="rounded-xl border-gray-200"
                        {...form.register("fullName")}
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="0412 345 678"
                        className="rounded-xl border-gray-200"
                        {...form.register("phone")}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="street" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      placeholder="Unit 1, 123 George St"
                      className="rounded-xl border-gray-200"
                      {...form.register("street")}
                    />
                    {form.formState.errors.street && (
                      <p className="text-xs text-red-500 font-medium">
                        {form.formState.errors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        City / Suburb
                      </Label>
                      <Input
                        id="city"
                        placeholder="Sydney"
                        className="rounded-xl border-gray-200"
                        {...form.register("city")}
                      />
                      {form.formState.errors.city && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        State
                      </Label>
                      <Select
                        defaultValue="NSW"
                        onValueChange={(val) => form.setValue("state", val)}
                      >
                        <SelectTrigger className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="NSW">NSW</SelectItem>
                          <SelectItem value="VIC">VIC</SelectItem>
                          <SelectItem value="QLD">QLD</SelectItem>
                          <SelectItem value="WA">WA</SelectItem>
                          <SelectItem value="SA">SA</SelectItem>
                          <SelectItem value="TAS">TAS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="postalCode" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Postcode
                      </Label>
                      <Input
                        id="postalCode"
                        placeholder="2000"
                        className="rounded-xl border-gray-200"
                        {...form.register("postalCode")}
                      />
                      {form.formState.errors.postalCode && (
                        <p className="text-xs text-red-500 font-medium">
                          {form.formState.errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isDefault"
                      checked={form.watch("isDefault")}
                      onCheckedChange={(checked) => form.setValue("isDefault", !!checked)}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="isDefault" className="text-sm text-gray-600 cursor-pointer">
                      Save as default shipping address
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl py-6 font-semibold shadow-xs cursor-pointer mt-4"
                  >
                    Validate & Submit Form
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: MODALS & OVERLAYS */}
          <TabsContent value="overlays" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dialog Modal */}
              <Card className="rounded-2xl border-gray-200/80 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Accessible Dialog Modal</CardTitle>
                  <CardDescription>Accessible backdrop modal via Radix UI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl cursor-pointer">
                        Open Product Modal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>DJI Mavic 4 Pro Fly More Combo</DialogTitle>
                        <DialogDescription>
                          In stock and ready for immediate dispatch from our Sydney warehouse.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-2">
                        <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <AlertTitle>Free Express Shipping</AlertTitle>
                          <AlertDescription>
                            Includes DJI Care Refresh 1-Year warranty coverage.
                          </AlertDescription>
                        </Alert>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="rounded-xl cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl cursor-pointer"
                          onClick={() => {
                            setIsDialogOpen(false);
                            toast.success("Added to Cart from Modal");
                          }}
                        >
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Sheet Slide-Over */}
              <Card className="rounded-2xl border-gray-200/80 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Slide-Over Drawer (Sheet)</CardTitle>
                  <CardDescription>Right or left drawer for cart and navigation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="rounded-xl cursor-pointer">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Open Quick Drawer
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Quick Cart Preview</SheetTitle>
                        <SheetDescription>
                          Inspect items in your shopping bag before proceeding to checkout.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6 space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                          <div className="w-14 h-14 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                            <Plane className="w-6 h-6 text-[#0071e3]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">DJI Avata 2</p>
                            <p className="text-xs text-gray-500">Qty: 1 • AUD $1,499</p>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 4: DATA & NAVIGATION */}
          <TabsContent value="data" className="space-y-8">
            {/* Table */}
            <Card className="rounded-2xl border-gray-200/80 shadow-2xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Product Inventory Table</CardTitle>
                <CardDescription>Clean tabular data layout</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">DJI-M4P-01</TableCell>
                      <TableCell className="font-medium">DJI Mavic 4 Pro</TableCell>
                      <TableCell>Camera Drones</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          In Stock
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">$3,299.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">DJI-AV2-02</TableCell>
                      <TableCell className="font-medium">DJI Avata 2 Fly More</TableCell>
                      <TableCell>FPV Drones</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          In Stock
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">$1,899.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">DJI-OP3-03</TableCell>
                      <TableCell className="font-medium">Osmo Pocket 3 Creator</TableCell>
                      <TableCell>Handheld</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pre-Order</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">$1,129.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination Demo */}
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
