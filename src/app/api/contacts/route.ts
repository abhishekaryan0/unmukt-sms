import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const group = searchParams.get("group");
    const dnd = searchParams.get("dnd");
    const search = searchParams.get("search");

    const where: any = {};
    if (customerId && customerId !== "all") where.customerId = customerId;
    if (group && group !== "all") where.groupName = group;
    if (dnd === "clean") where.isDnd = false;
    if (dnd === "dnd") where.isDnd = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = contacts.map((c) => ({
      id: c.id,
      name: c.name,
      mobile: c.mobile,
      email: c.email || "",
      group: c.groupName,
      tags: c.tags,
      smsConsent: c.smsConsent,
      whatsappConsent: c.whatsappConsent,
      isDnd: c.isDnd,
      dateAdded: c.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId = "cust-01", contacts, contact } = body;

    // Single contact add
    if (contact) {
      const cleanMobile = contact.mobile.replace(/\D/g, "").slice(-10);
      const created = await prisma.contact.create({
        data: {
          customerId,
          name: contact.name,
          mobile: cleanMobile,
          email: contact.email || null,
          groupName: contact.group || "Regular Customers",
          tags: contact.tags || [],
          smsConsent: contact.smsConsent ?? true,
          whatsappConsent: contact.whatsappConsent ?? true,
          isDnd: contact.isDnd ?? false,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Contact ${created.name} added`,
        data: {
          id: created.id,
          name: created.name,
          mobile: created.mobile,
          email: created.email || "",
          group: created.groupName,
          tags: created.tags,
          smsConsent: created.smsConsent,
          whatsappConsent: created.whatsappConsent,
          isDnd: created.isDnd,
          dateAdded: created.createdAt.toISOString().split("T")[0],
        },
      });
    }

    // Batch import
    if (Array.isArray(contacts)) {
      const validRows = contacts
        .map((c: any) => ({
          customerId,
          name: c.name,
          mobile: c.mobile.replace(/\D/g, "").slice(-10),
          email: c.email || null,
          groupName: c.group || "Regular Customers",
          tags: c.tags || ["CSV Import"],
          smsConsent: c.smsConsent ?? true,
          whatsappConsent: c.whatsappConsent ?? true,
          isDnd: c.isDnd ?? false,
        }))
        .filter((c: any) => c.mobile.length === 10);

      const count = await prisma.contact.createMany({
        data: validRows,
        skipDuplicates: true,
      });

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${count.count} contacts`,
        importedCount: count.count,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Contact ID required" }, { status: 400 });
    }

    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Contact deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
