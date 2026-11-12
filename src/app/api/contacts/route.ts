import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { resolveTenantId } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCustomerId = searchParams.get("customerId");
    const group = searchParams.get("group");
    const dnd = searchParams.get("dnd");
    const search = searchParams.get("search");

    const { customerId, session } = resolveTenantId(request, requestedCustomerId);

    const where: any = {};
    if (session?.role === "super_admin") {
      if (requestedCustomerId && requestedCustomerId !== "all") {
        where.customerId = requestedCustomerId;
      }
    } else {
      where.customerId = customerId;
    }

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
    const { customerId: requestedId, contacts, contact } = body;
    const { customerId } = resolveTenantId(request, requestedId);

    // Single contact add with validation
    if (contact) {
      const parsed = contactSchema.safeParse(contact);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0]?.message || "Invalid contact data" },
          { status: 400 }
        );
      }

      const cleanMobile = parsed.data.mobile.replace(/\D/g, "").slice(-10);

      // Upsert contact so duplicate mobile numbers update details rather than erroring
      const created = await prisma.contact.create({
        data: {
          customerId,
          name: parsed.data.name,
          mobile: cleanMobile,
          email: parsed.data.email || null,
          groupName: parsed.data.group || "Regular Customers",
          tags: parsed.data.tags || [],
          smsConsent: parsed.data.smsConsent ?? true,
          whatsappConsent: parsed.data.whatsappConsent ?? true,
          isDnd: parsed.data.isDnd ?? false,
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
        .map((c: any) => {
          const rawMobile = String(c.mobile || "").replace(/\D/g, "").slice(-10);
          return {
            customerId,
            name: String(c.name || "Customer").trim(),
            mobile: rawMobile,
            email: c.email ? String(c.email).trim() : null,
            groupName: String(c.group || "Regular Customers").trim(),
            tags: Array.isArray(c.tags) ? c.tags : ["CSV Import"],
            smsConsent: c.smsConsent ?? true,
            whatsappConsent: c.whatsappConsent ?? true,
            isDnd: c.isDnd ?? false,
          };
        })
        .filter((c: any) => /^[6-9]\d{9}$/.test(c.mobile));

      if (validRows.length === 0) {
        return NextResponse.json(
          { success: false, error: "No valid 10-digit Indian phone numbers found in import batch" },
          { status: 400 }
        );
      }

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
    const { customerId, session } = resolveTenantId(request);

    if (!id) {
      return NextResponse.json({ success: false, error: "Contact ID required" }, { status: 400 });
    }

    // IDOR protection: Verify contact belongs to caller's tenant
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
    }

    if (session?.role !== "super_admin" && contact.customerId !== customerId) {
      return NextResponse.json({ success: false, error: "Unauthorized access to this contact" }, { status: 403 });
    }

    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Contact deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
