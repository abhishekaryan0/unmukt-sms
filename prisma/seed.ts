import { PrismaClient, Role, AccountStatus, HeaderStatus, CampaignStatus, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SMS Unmukt PostgreSQL Database Seeding...");

  // Clean existing records in reverse dependency order
  await prisma.messageLog.deleteMany({});
  await prisma.ticketMessage.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.walletTransaction.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.contactGroup.deleteMany({});
  await prisma.template.deleteMany({});
  await prisma.senderHeader.deleteMany({});
  await prisma.whatsAppProfile.deleteMany({});
  await prisma.pricingConfig.deleteMany({});
  await prisma.routingRule.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.agencyProfile.deleteMany({});
  await prisma.customerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  console.log("Creating System Users...");
  const adminUser = await prisma.user.create({
    data: {
      id: "usr_admin_01",
      email: "admin@messagehub.in",
      passwordHash: "Admin@123", // In production, bcrypt-hashed
      name: "Vikram Malhotra",
      role: Role.SUPER_ADMIN,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      id: "usr_client_01",
      email: "demo@messagehub.in",
      passwordHash: "Demo@123",
      name: "Rajesh Sharma",
      role: Role.CLIENT,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  });

  const agencyUser = await prisma.user.create({
    data: {
      id: "usr_agency_01",
      email: "agency@growthdigital.in",
      passwordHash: "Agency@123",
      name: "Aditya Verma",
      role: Role.AGENCY,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
  });

  // 2. Create Customer Profiles
  console.log("Creating Indian Customer Businesses...");
  const primaryCustomer = await prisma.customerProfile.create({
    data: {
      id: "cust-01",
      userId: clientUser.id,
      businessName: "Sharma Fashion Store",
      ownerName: "Rajesh Sharma",
      email: "demo@messagehub.in",
      mobile: "9811234567",
      businessCategory: "Retail & Apparel",
      city: "Central Delhi",
      state: "Delhi",
      gstin: "07AAAAA0000A1Z5",
      dltEntityId: "1701159820000034",
      walletBalance: 2450.0,
      totalMessages: 84500,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const customer2 = await prisma.customerProfile.create({
    data: {
      id: "cust-02",
      businessName: "Gupta Electronics & Appliances",
      ownerName: "Amit Gupta",
      email: "amit@guptaelectronics.in",
      mobile: "9823456789",
      businessCategory: "Consumer Electronics",
      city: "Mumbai",
      state: "Maharashtra",
      gstin: "27AABCU9603R1ZM",
      dltEntityId: "1701159820000035",
      walletBalance: 4800.0,
      totalMessages: 142000,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const customer3 = await prisma.customerProfile.create({
    data: {
      id: "cust-03",
      businessName: "Bright Future Coaching Institute",
      ownerName: "Dr. Sunita Rao",
      email: "info@brightfuture.edu.in",
      mobile: "9834567890",
      businessCategory: "Education & Coaching",
      city: "Jaipur",
      state: "Rajasthan",
      gstin: "08AABCB1234L1Z1",
      dltEntityId: "1701159820000036",
      walletBalance: 8200.0,
      totalMessages: 310000,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const customer4 = await prisma.customerProfile.create({
    data: {
      id: "cust-04",
      businessName: "Royal Dine Restaurant & Banquet",
      ownerName: "Kabir Khan",
      email: "reservations@royaldine.in",
      mobile: "9845678901",
      businessCategory: "Hospitality & Dining",
      city: "Bengaluru",
      state: "Karnataka",
      gstin: "29AABCR5678P1ZQ",
      dltEntityId: "1701159820000037",
      walletBalance: 1950.0,
      totalMessages: 64200,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const customer5 = await prisma.customerProfile.create({
    data: {
      id: "cust-05",
      businessName: "Prime Horizon Realty",
      ownerName: "Rohan Deshmukh",
      email: "sales@primehorizon.in",
      mobile: "9856789012",
      businessCategory: "Real Estate",
      city: "Hyderabad",
      state: "Telangana",
      gstin: "36AABCP9012K1ZX",
      dltEntityId: "1701159820000038",
      walletBalance: 6500.0,
      totalMessages: 198000,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  // 3. Create Agency Profile
  console.log("Creating Agency Profiles...");
  await prisma.agencyProfile.create({
    data: {
      id: "agency-01",
      userId: agencyUser.id,
      agencyName: "Digital Growth Agency",
      ownerName: "Aditya Verma",
      email: "agency@growthdigital.in",
      phone: "+91 98990 12345",
      city: "Bengaluru",
      state: "Karnataka",
      walletBalance: 45000.0,
      clientCount: 18,
      pricingDiscount: 15.0,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  await prisma.agencyProfile.create({
    data: {
      id: "agency-02",
      agencyName: "NexGen Brand Reach LLP",
      ownerName: "Kavita Singhania",
      email: "kavita@nexgenreach.in",
      phone: "+91 98765 43210",
      city: "Mumbai",
      state: "Maharashtra",
      walletBalance: 28500.0,
      clientCount: 12,
      pricingDiscount: 12.0,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  // 4. Create TRAI DLT Sender Headers
  console.log("Creating TRAI DLT Sender Headers...");
  await prisma.senderHeader.createMany({
    data: [
      {
        id: "hdr-01",
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        header: "SHRFSH",
        category: "promotional",
        dltEntityId: primaryCustomer.dltEntityId,
        dltOperator: "Reliance Jio DLT",
        description: "Official promotional broadcast header for Sharma Fashion Store",
        status: HeaderStatus.APPROVED,
      },
      {
        id: "hdr-02",
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        header: "SHRETH",
        category: "transactional",
        dltEntityId: primaryCustomer.dltEntityId,
        dltOperator: "Bharti Airtel DLT",
        description: "Transactional order confirmation and invoice OTP alerts",
        status: HeaderStatus.APPROVED,
      },
      {
        id: "hdr-03",
        customerId: customer2.id,
        customerName: customer2.businessName,
        header: "GUPTAE",
        category: "promotional",
        dltEntityId: customer2.dltEntityId,
        dltOperator: "Vodafone Idea (Vi) DLT",
        description: "Gupta Electronics appliance festive sales",
        status: HeaderStatus.APPROVED,
      },
      {
        id: "hdr-04",
        customerId: customer3.id,
        customerName: customer3.businessName,
        header: "BRTFTR",
        category: "transactional",
        dltEntityId: customer3.dltEntityId,
        dltOperator: "Bharti Airtel DLT",
        description: "Attendance and test score alerts for students and parents",
        status: HeaderStatus.APPROVED,
      },
      {
        id: "hdr-05",
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        header: "SHRCOL",
        category: "promotional",
        dltEntityId: primaryCustomer.dltEntityId,
        dltOperator: "BSNL DLT Portal",
        description: "Winter Collection 2026 Header",
        status: HeaderStatus.PENDING,
      },
    ],
  });

  // 5. Create WhatsApp Business Profiles
  console.log("Creating WhatsApp Business API Profiles...");
  await prisma.whatsAppProfile.create({
    data: {
      customerId: primaryCustomer.id,
      displayName: "Sharma Fashion Store",
      phoneNumber: "+91 80009 12345",
      wabaId: "waba_781290348123",
      qualityRating: "High",
      messagingTier: "Tier 2 (10,000 unique recipients / 24h)",
      verifiedBadge: true,
      webhookStatus: "active",
      about: "Premium Ethnic Wear, Bridal Lehengas & Sarees in Delhi",
      category: "Apparel & Clothing",
    },
  });

  await prisma.whatsAppProfile.create({
    data: {
      customerId: customer2.id,
      displayName: "Gupta Electronics",
      phoneNumber: "+91 80009 67890",
      wabaId: "waba_781290348124",
      qualityRating: "High",
      messagingTier: "Tier 2 (10,000 unique recipients / 24h)",
      verifiedBadge: true,
      webhookStatus: "active",
      about: "Authorized Sony, Samsung, LG dealer in Mumbai",
      category: "Consumer Electronics",
    },
  });

  // 6. Create Contact Groups and Contacts
  console.log("Creating Customer Phonebook & Contact Groups...");
  const grp1 = await prisma.contactGroup.create({
    data: {
      id: "grp-01",
      customerId: primaryCustomer.id,
      name: "Regular Customers",
      description: "Loyal in-store shoppers with 3+ purchases",
    },
  });

  const grp2 = await prisma.contactGroup.create({
    data: {
      id: "grp-02",
      customerId: primaryCustomer.id,
      name: "Festival Offers",
      description: "Diwali, Eid and Wedding season buyers",
    },
  });

  const grp3 = await prisma.contactGroup.create({
    data: {
      id: "grp-03",
      customerId: primaryCustomer.id,
      name: "Wholesale Buyers",
      description: "Bulk textile resellers and boutique owners",
    },
  });

  await prisma.contact.createMany({
    data: [
      {
        customerId: primaryCustomer.id,
        groupId: grp1.id,
        groupName: grp1.name,
        name: "Aakash Sharma",
        mobile: "9811234567",
        email: "aakash@gmail.com",
        tags: ["VIP", "Repeat", "Ethnic"],
        smsConsent: true,
        whatsappConsent: true,
        isDnd: false,
      },
      {
        customerId: primaryCustomer.id,
        groupId: grp2.id,
        groupName: grp2.name,
        name: "Priya Patel",
        mobile: "9823456789",
        email: "priya@yahoo.com",
        tags: ["Bridal", "Diwali"],
        smsConsent: true,
        whatsappConsent: true,
        isDnd: false,
      },
      {
        customerId: primaryCustomer.id,
        groupId: grp3.id,
        groupName: grp3.name,
        name: "Vikram Malhotra",
        mobile: "9899001122",
        email: "vikram@malhotra.com",
        tags: ["Wholesale", "Sarees"],
        smsConsent: true,
        whatsappConsent: true,
        isDnd: true, // Registered on DND
      },
      {
        customerId: primaryCustomer.id,
        groupId: grp1.id,
        groupName: grp1.name,
        name: "Sunita Kapoor",
        mobile: "9876543210",
        email: "sunita@outlook.com",
        tags: ["Loyalty"],
        smsConsent: true,
        whatsappConsent: true,
        isDnd: false,
      },
      {
        customerId: primaryCustomer.id,
        groupId: grp2.id,
        groupName: grp2.name,
        name: "Rahul Verma",
        mobile: "9810987654",
        email: "rahul@gmail.com",
        tags: ["Festive"],
        smsConsent: true,
        whatsappConsent: true,
        isDnd: false,
      },
      {
        customerId: primaryCustomer.id,
        groupId: grp1.id,
        groupName: grp1.name,
        name: "Ananya Iyer",
        mobile: "9845123456",
        email: "ananya@gmail.com",
        tags: ["Silk Sarees", "VIP"],
        smsConsent: true,
        whatsappConsent: true,
        isDnd: false,
      },
      {
        customerId: primaryCustomer.id,
        groupId: grp3.id,
        groupName: grp3.name,
        name: "Deepak Mehra",
        mobile: "9811882233",
        email: "deepak@mehraexports.in",
        tags: ["Bulk Trader", "Boutique"],
        smsConsent: true,
        whatsappConsent: true,
        isDnd: false,
      },
    ],
  });

  // 7. Create Reusable DLT & WhatsApp Templates
  console.log("Creating Templates...");
  await prisma.template.createMany({
    data: [
      {
        id: "tpl-01",
        name: "Diwali Festive Offer",
        channel: "whatsapp",
        category: "marketing",
        language: "Hinglish",
        content: "Namaste {{1}}! ✨ Diwali Festive Dhamaka at Sharma Fashion Store. Get flat {{2}}% OFF on all Silk Sarees & Ethnic Kurtis. Visit us today at Chandni Chowk or shop online!",
        metaTemplateId: "wa_festive_diwali_v1",
        approvalStatus: "approved",
        variables: ["Customer Name", "Discount Percentage"],
        buttons: [
          { type: "URL", label: "Shop Online", value: "https://sharmafashion.in" },
          { type: "PHONE", label: "Call Store", value: "+919811234567" },
        ],
      },
      {
        id: "tpl-02",
        name: "Weekend Flash Sale Alert",
        channel: "sms",
        category: "promotional",
        language: "English",
        content: "Exclusive Weekend Sale! Buy 1 Get 1 Free on all Women Suits & Sarees at Sharma Fashion Store Delhi. Valid till Sunday only. Show this SMS at counter. - SHRFSH",
        dltTemplateId: "1707161234567890123",
        senderHeader: "SHRFSH",
        approvalStatus: "approved",
        variables: [],
      },
      {
        id: "tpl-03",
        name: "Order Dispatch & Delivery OTP",
        channel: "sms",
        category: "transactional",
        language: "English",
        content: "Dear {#var#}, your order #{#var#} has been dispatched. Share OTP {#var#} with delivery executive upon arrival. Thank you for shopping with Sharma Fashion Store! - SHRETH",
        dltTemplateId: "1707161234567890124",
        senderHeader: "SHRETH",
        approvalStatus: "approved",
        variables: ["Name", "Order ID", "OTP"],
      },
      {
        id: "tpl-04",
        name: "Order Tracking WhatsApp Update",
        channel: "whatsapp",
        category: "utility",
        language: "English",
        content: "Hello {{1}}, your order #{{2}} is out for delivery with our courier partner. Expected delivery by {{3}}.",
        metaTemplateId: "wa_order_utility_v2",
        approvalStatus: "approved",
        variables: ["Customer Name", "Order ID", "Delivery Time"],
        buttons: [{ type: "URL", label: "Track Package", value: "https://track.messagehub.in" }],
      },
    ],
  });

  // 8. Create Campaigns
  console.log("Creating Marketing Campaigns...");
  await prisma.campaign.createMany({
    data: [
      {
        id: "cmp-01",
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        campaignName: "Diwali Ethnic Wear Mega Blast",
        channel: "whatsapp",
        messageType: "marketing",
        templateName: "Diwali Festive Offer",
        messageContent: "Namaste Priya ji! ✨ Diwali Festive Dhamaka at Sharma Fashion Store. Get flat 40% OFF on all Silk Sarees & Ethnic Kurtis. Visit us today!",
        mediaUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop",
        totalRecipients: 1250,
        delivered: 1242,
        failed: 8,
        pending: 0,
        cost: 1375.0,
        status: CampaignStatus.COMPLETED,
        createdAt: new Date("2026-11-09T11:00:00Z"),
      },
      {
        id: "cmp-02",
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        campaignName: "Weekend Flat 20% In-Store SMS",
        channel: "sms",
        messageType: "promotional",
        senderId: "SHRFSH",
        templateName: "Weekend Flash Sale Alert",
        messageContent: "Exclusive Weekend Sale! Buy 1 Get 1 Free on all Women Suits & Sarees at Sharma Fashion Store Delhi. Valid till Sunday only. Show this SMS at counter. - SHRFSH",
        totalRecipients: 3500,
        delivered: 3482,
        failed: 18,
        pending: 0,
        cost: 770.0,
        status: CampaignStatus.COMPLETED,
        createdAt: new Date("2026-11-07T09:30:00Z"),
      },
      {
        id: "cmp-03",
        customerId: customer2.id,
        customerName: customer2.businessName,
        campaignName: "Smart LED TV Cashback Promo",
        channel: "sms",
        messageType: "promotional",
        senderId: "GUPTAE",
        templateName: "Gupta Electronics Promo",
        messageContent: "Diwali Special: Up to 50% discount + ₹3000 instant cashback on 55-inch 4K Smart TVs at Gupta Electronics Mumbai! - GUPTAE",
        totalRecipients: 5000,
        delivered: 4975,
        failed: 25,
        pending: 0,
        cost: 1100.0,
        status: CampaignStatus.COMPLETED,
        createdAt: new Date("2026-11-08T14:15:00Z"),
      },
      {
        id: "cmp-04",
        customerId: customer3.id,
        customerName: customer3.businessName,
        campaignName: "IIT-JEE Crash Course Admission Alert",
        channel: "sms",
        messageType: "transactional",
        senderId: "BRTFTR",
        templateName: "Admission Alert",
        messageContent: "Admissions open for Ranker Batch 2027. Early bird scholarship test this Sunday at Bright Future Kota. - BRTFTR",
        totalRecipients: 8000,
        delivered: 7980,
        failed: 20,
        pending: 0,
        cost: 2000.0,
        status: CampaignStatus.COMPLETED,
        createdAt: new Date("2026-11-10T10:00:00Z"),
      },
    ],
  });

  // 9. Create Wallet Transactions & Invoices
  console.log("Creating Wallet Transactions & Invoices...");
  await prisma.walletTransaction.createMany({
    data: [
      {
        customerId: primaryCustomer.id,
        type: TransactionType.RECHARGE,
        amount: 3000.0,
        previousBalance: 220.0,
        newBalance: 3220.0,
        reference: "TXN-UPI-88991244",
        description: "Prepaid Wallet Recharge via Google Pay UPI (Includes 18% GST)",
        createdAt: new Date("2026-11-05T10:20:00Z"),
      },
      {
        customerId: primaryCustomer.id,
        type: TransactionType.WHATSAPP_DEDUCTION,
        amount: 1375.0,
        previousBalance: 3220.0,
        newBalance: 1845.0,
        reference: "CMP-WA-DIWALI",
        description: "Deduction for 1,250 WhatsApp marketing messages @ ₹1.10/msg",
        channel: "whatsapp",
        createdAt: new Date("2026-11-09T11:05:00Z"),
      },
      {
        customerId: primaryCustomer.id,
        type: TransactionType.SMS_DEDUCTION,
        amount: 770.0,
        previousBalance: 1845.0,
        newBalance: 1075.0,
        reference: "CMP-SMS-WEEKEND",
        description: "Deduction for 3,500 Promotional SMS units @ ₹0.22/SMS",
        channel: "sms",
        createdAt: new Date("2026-11-07T09:35:00Z"),
      },
      {
        customerId: primaryCustomer.id,
        type: TransactionType.RECHARGE,
        amount: 2000.0,
        previousBalance: 1075.0,
        newBalance: 3075.0,
        reference: "TXN-NB-44119932",
        description: "Prepaid Wallet Top-up via HDFC Net Banking",
        createdAt: new Date("2026-11-10T16:45:00Z"),
      },
      {
        customerId: primaryCustomer.id,
        type: TransactionType.MANUAL_CREDIT,
        amount: 250.0,
        previousBalance: 3075.0,
        newBalance: 3325.0,
        reference: "ADM-CREDIT-772",
        description: "Promotional Onboarding Bonus applied by Admin",
        createdAt: new Date("2026-11-01T12:00:00Z"),
      },
    ],
  });

  await prisma.invoice.createMany({
    data: [
      {
        id: "inv-01",
        invoiceNumber: "INV/2026-27/00481",
        customerId: primaryCustomer.id,
        businessName: primaryCustomer.businessName,
        ownerName: primaryCustomer.ownerName,
        gstin: primaryCustomer.gstin!,
        billingAddress: "Shop 14, Main Cloth Market, Chandni Chowk, Central Delhi - 110006",
        amount: 2542.37,
        gst: 457.63, // 18% GST (CGST 228.815 + SGST 228.815)
        totalAmount: 3000.0,
        paymentStatus: "paid",
        description: "Prepaid Bulk SMS & WhatsApp Messaging Credits Recharge",
        transactionReference: "TXN-UPI-88991244",
        createdAt: new Date("2026-11-05T10:20:00Z"),
      },
      {
        id: "inv-02",
        invoiceNumber: "INV/2026-27/00512",
        customerId: primaryCustomer.id,
        businessName: primaryCustomer.businessName,
        ownerName: primaryCustomer.ownerName,
        gstin: primaryCustomer.gstin!,
        billingAddress: "Shop 14, Main Cloth Market, Chandni Chowk, Central Delhi - 110006",
        amount: 1694.92,
        gst: 305.08,
        totalAmount: 2000.0,
        paymentStatus: "paid",
        description: "Prepaid Bulk SMS & WhatsApp Messaging Credits Recharge",
        transactionReference: "TXN-NB-44119932",
        createdAt: new Date("2026-11-10T16:45:00Z"),
      },
    ],
  });

  // 10. Create Telecom Suppliers
  console.log("Creating Telecom Carrier Switches & Suppliers...");
  await prisma.supplier.createMany({
    data: [
      {
        id: "sup-01",
        name: "EJOIN EIMS Bulk Gateway",
        channel: "sms",
        status: "connected",
        costPerMessage: 0.09,
        totalMessages: 5800000,
        successRate: 99.4,
        failedCount: 34800,
        apiEndpoint: "https://eims.ejointech.com/api/v2/sms/send",
      },
      {
        id: "sup-02",
        name: "RouteMobile Priority Switch",
        channel: "sms",
        status: "connected",
        costPerMessage: 0.12,
        totalMessages: 2660000,
        successRate: 99.8,
        failedCount: 5320,
        apiEndpoint: "https://api.routemobile.com/v1/messaging/direct",
      },
      {
        id: "sup-03",
        name: "Bharti Airtel Telecom Switch",
        channel: "sms",
        status: "connected",
        costPerMessage: 0.11,
        totalMessages: 1850000,
        successRate: 99.7,
        failedCount: 5550,
        apiEndpoint: "https://iq.airtel.in/gateway/v1/sms",
      },
      {
        id: "sup-04",
        name: "Meta WhatsApp Cloud API",
        channel: "whatsapp",
        status: "connected",
        costPerMessage: 0.78,
        totalMessages: 1280000,
        successRate: 99.6,
        failedCount: 5120,
        apiEndpoint: "https://graph.facebook.com/v20.0/messages",
      },
    ],
  });

  // 11. Create Routing Rules
  console.log("Creating Routing Rules...");
  await prisma.routingRule.createMany({
    data: [
      {
        name: "Promotional SMS Default Carrier",
        channel: "sms",
        messageType: "promotional",
        primarySupplier: "EJOIN EIMS Bulk Gateway",
        fallbackSupplier: "RouteMobile Priority Switch",
        priority: 1,
        ratePerMsg: 0.09,
        status: "active",
      },
      {
        name: "Transactional & OTP SMS High Priority",
        channel: "sms",
        messageType: "transactional",
        primarySupplier: "RouteMobile Priority Switch",
        fallbackSupplier: "Bharti Airtel Telecom Switch",
        priority: 1,
        ratePerMsg: 0.12,
        status: "active",
      },
      {
        name: "WhatsApp Marketing Campaigns",
        channel: "whatsapp",
        messageType: "marketing",
        primarySupplier: "Meta WhatsApp Cloud API",
        fallbackSupplier: "Meta WhatsApp Cloud API",
        priority: 1,
        ratePerMsg: 0.78,
        status: "active",
      },
    ],
  });

  // 12. Create Pricing Configuration
  console.log("Creating Platform Pricing & Margins...");
  await prisma.pricingConfig.createMany({
    data: [
      {
        channel: "sms",
        type: "promotional_sms",
        supplierCost: 0.09,
        sellingPrice: 0.22,
        grossMargin: 0.13,
      },
      {
        channel: "sms",
        type: "transactional_sms",
        supplierCost: 0.12,
        sellingPrice: 0.25,
        grossMargin: 0.13,
      },
      {
        channel: "whatsapp",
        type: "whatsapp_marketing",
        supplierCost: 0.78,
        sellingPrice: 1.1,
        grossMargin: 0.32,
      },
      {
        channel: "whatsapp",
        type: "whatsapp_utility",
        supplierCost: 0.12,
        sellingPrice: 0.2,
        grossMargin: 0.08,
      },
    ],
  });

  // 13. Create Support Tickets
  console.log("Creating Support Tickets...");
  const tkt1 = await prisma.supportTicket.create({
    data: {
      id: "tkt-01",
      customerId: primaryCustomer.id,
      customerName: primaryCustomer.businessName,
      subject: "DLT Header 'SHRCOL' Approval Status Enquiry",
      category: "DLT Approval",
      priority: "medium",
      status: "in_progress",
    },
  });

  await prisma.ticketMessage.createMany({
    data: [
      {
        ticketId: tkt1.id,
        sender: "customer",
        senderName: "Rajesh Sharma",
        message: "Namaste team, we submitted header SHRCOL on BSNL DLT 2 days ago for our winter festive collection. Could you expedite review?",
        createdAt: new Date("2026-11-10T11:00:00Z"),
      },
      {
        ticketId: tkt1.id,
        sender: "support",
        senderName: "Support Desk",
        message: "Hello Rajesh ji, we have escalated this to BSNL nodal telemarketer desk. It should be approved within 2-4 business hours.",
        createdAt: new Date("2026-11-10T12:30:00Z"),
      },
    ],
  });

  // 14. Create CDR Message Logs
  console.log("Creating Call Detail Records (CDR) Message Logs...");
  await prisma.messageLog.createMany({
    data: [
      {
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        channel: "sms",
        senderId: "SHRFSH",
        recipient: "+91 98112 34567",
        route: "EJOIN-PROMO-01",
        cost: 0.22,
        supplierCost: 0.09,
        status: "delivered",
        timestamp: new Date("2026-11-11T13:45:00Z"),
      },
      {
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        channel: "sms",
        senderId: "SHRFSH",
        recipient: "+91 98234 56789",
        route: "EJOIN-PROMO-01",
        cost: 0.22,
        supplierCost: 0.09,
        status: "delivered",
        timestamp: new Date("2026-11-11T13:45:01Z"),
      },
      {
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        channel: "whatsapp",
        senderId: "+91 80009 12345",
        recipient: "+91 98765 43210",
        route: "META-CLOUD-DIRECT",
        cost: 1.1,
        supplierCost: 0.78,
        status: "delivered",
        timestamp: new Date("2026-11-11T13:50:00Z"),
      },
      {
        customerId: customer2.id,
        customerName: customer2.businessName,
        channel: "sms",
        senderId: "GUPTAE",
        recipient: "+91 98990 01122",
        route: "ROUTEMOBILE-TRANS",
        cost: 0.25,
        supplierCost: 0.12,
        status: "delivered",
        timestamp: new Date("2026-11-11T14:10:00Z"),
      },
      {
        customerId: primaryCustomer.id,
        customerName: primaryCustomer.businessName,
        channel: "sms",
        senderId: "SHRFSH",
        recipient: "+91 98450 99887",
        route: "EJOIN-PROMO-01",
        cost: 0.22,
        supplierCost: 0.09,
        status: "failed", // DND block
        timestamp: new Date("2026-11-11T14:15:00Z"),
      },
    ],
  });

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
