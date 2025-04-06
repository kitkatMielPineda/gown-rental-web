// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
// import Papa from "https://esm.sh/papaparse@5.4.1";
// import dayjs from "https://esm.sh/dayjs@1.11.10";
// import { Resend } from "https://esm.sh/resend";

// serve(async (_req) => {
//   // console.log("🧪 SUPABASE_URL:", Deno.env.get("SUPABASE_URL"));
//   // console.log(
//   //   "🧪 SUPABASE_SERVICE_ROLE_KEY:",
//   //   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.slice(0, 10) + "..."
//   // );

//   // console.log("Triggered function");
//   // console.log("📨 Edge function triggered!");

//   const supabase = createClient(
//     Deno.env.get("SUPABASE_URL")!,
//     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//   );
//   try {
//     // 1. Identify the correct quarterly range
//     const now = new Date();
//     let year = now.getFullYear();
//     const month = now.getMonth() + 1; // Jan = 1

//     let startMonth = 1;
//     let endMonth = 3;

//     if (month === 4) {
//       startMonth = 1;
//       endMonth = 3;
//     } else if (month === 7) {
//       startMonth = 4;
//       endMonth = 6;
//     } else if (month === 10) {
//       startMonth = 7;
//       endMonth = 9;
//     } else if (month === 1) {
//       startMonth = 10;
//       endMonth = 12;
//       year -= 1;
//     } else {
//       return new Response("Not a scheduled archive month", { status: 400 });
//     }

//     const from = `${year}-${String(startMonth).padStart(2, "0")}-01`;
//     const to = dayjs(`${year}-${String(endMonth).padStart(2, "0")}-01`)
//       .endOf("month")
//       .format("YYYY-MM-DD");

//     // 2. Fetch Rental and Expense Data
//     // console.log("⏳ Fetching rentals...");
//     const { data: rentals, error: rentalError } = await supabase
//       .from("Rental")
//       .select("*")
//       .gte("pickupDate", from)
//       .lte("pickupDate", to);

//     if (rentalError) {
//       console.error("❌ Rental fetch error:", rentalError);
//       throw new Error("Failed to fetch rentals");
//     }

//     const { data: expenses, error: expenseError } = await supabase
//       .from("Expense")
//       .select("*")
//       .gte("createdAt", from)
//       .lte("createdAt", to);

//     if (expenseError) {
//       // console.error("❌ Expense fetch error:", expenseError);
//       throw new Error("Failed to fetch expenses");
//     }

//     const { data: testData, error: testError } = await supabase
//       .from("Rental")
//       .select("id")
//       .limit(1);

//     // if (testError) {
//     //   console.error("❌ Rental test failed:", testError);
//     // }

//     // 3. Generate Earnings/Expenses Summary
//     const paymentModes = [
//       "GCASH",
//       "Maya",
//       "GoTyme",
//       "BPI",
//       "BDO",
//       "UnionBank",
//       "Metrobank",
//       "Cash",
//     ];

//     const summary = [];
//     const monthMap: Record<string, any> = {};

//     rentals.forEach((rental) => {
//       const monthKey = new Date(rental.pickupDate).toISOString().slice(0, 7);
//       if (!monthMap[monthKey]) {
//         monthMap[monthKey] = {
//           monthLabel: dayjs(rental.pickupDate).format("MMMM YYYY"),
//           totalEarnings: 0,
//           totalExpenses: 0,
//           breakdown: {},
//         };
//         paymentModes.forEach((mode) => {
//           monthMap[monthKey].breakdown[mode] = { earnings: 0, expenses: 0 };
//         });
//       }

//       if (rental.downPaymentMode) {
//         const amt = Number(rental.downPayment || 0);
//         monthMap[monthKey].breakdown[rental.downPaymentMode].earnings += amt;
//         monthMap[monthKey].totalEarnings += amt;
//       }

//       if (rental.finalPaymentMode) {
//         const amt = Number(rental.finalPayment || 0);
//         monthMap[monthKey].breakdown[rental.finalPaymentMode].earnings += amt;
//         monthMap[monthKey].totalEarnings += amt;
//       }
//     });

//     expenses.forEach((expense) => {
//       const monthKey = new Date(expense.createdAt).toISOString().slice(0, 7);
//       if (!monthMap[monthKey]) {
//         monthMap[monthKey] = {
//           monthLabel: dayjs(expense.createdAt).format("MMMM YYYY"),
//           totalEarnings: 0,
//           totalExpenses: 0,
//           breakdown: {},
//         };
//         paymentModes.forEach((mode) => {
//           monthMap[monthKey].breakdown[mode] = { earnings: 0, expenses: 0 };
//         });
//       }

//       if (expense.paymentMode) {
//         const amt = Number(expense.amount || 0);
//         monthMap[monthKey].breakdown[expense.paymentMode].expenses += amt;
//         monthMap[monthKey].totalExpenses += amt;
//       }
//     });

//     summary.push(...Object.values(monthMap));

//     // 4. Generate CSVs
//     const csvRentals = Papa.unparse(rentals);
//     const csvExpenses = Papa.unparse(expenses);
//     const csvSummary = Papa.unparse(
//       summary.map((item) => ({
//         month: item.monthLabel,
//         ...Object.fromEntries(
//           Object.entries(item.breakdown).flatMap(([mode, val]) => [
//             [`${mode}_earnings`, val.earnings],
//             [`${mode}_expenses`, val.expenses],
//           ])
//         ),
//         totalEarnings: item.totalEarnings,
//         totalExpenses: item.totalExpenses,
//       }))
//     );

//     // 5. Generate PDF
//     const pdfBuffer = await createPdfReport(rentals, expenses, summary);

//     // 6. Send Email using Resend
//     const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

//     await resend.emails.send({
//       from: "Keith's Gown Rental <onboarding@resend.dev>",
//       to: "kitkat.miel.pineda@gmail.com",
//       subject: `Quarterly Report - ${from} to ${to}`,
//       html: "<p>Attached are the quarterly rental, expenses, and summary reports.</p>",
//       attachments: [
//         {
//           filename: "rentals.csv",
//           content: btoa(unescape(encodeURIComponent(csvRentals))),
//         },
//         {
//           filename: "expenses.csv",
//           content: btoa(unescape(encodeURIComponent(csvExpenses))),
//         },
//         {
//           filename: "summary.csv",
//           content: btoa(unescape(encodeURIComponent(csvSummary))),
//         },
//         {
//           filename: "summary.pdf",
//           content: btoa(String.fromCharCode(...new Uint8Array(pdfBuffer))),
//         },
//       ],
//     });

//     return new Response("✅ Email sent and report generated!", {
//       status: 200,
//     });
//   } catch (err) {
//     // console.error("❌ Error in quarterly archive function:", err);
//     return new Response(`Error occurred: ${err?.message || err?.toString()}`, {
//       status: 500,
//     });
//   }
// });

// async function createPdfReport(
//   rentals: any[],
//   expenses: any[],
//   summary: any[]
// ) {
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();
//   const { height } = page.getSize();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontSize = 12;
//   const margin = 50;
//   const lineHeight = fontSize + 5;
//   let y = height - margin;

//   const writeLine = (text: string) => {
//     if (y < margin + lineHeight) {
//       y = height - margin;
//     }
//     page.drawText(text, {
//       x: margin,
//       y,
//       size: fontSize,
//       font,
//       color: rgb(0, 0, 0),
//     });
//     y -= lineHeight;
//   };

//   writeLine("*** Quarterly Report ***\n");

//   writeLine("== RENTALS ==");
//   rentals.forEach((r) => {
//     writeLine(`${r.name} | Pickup: ${dayjs(r.pickupDate).format("MMM D")}`);
//   });

//   writeLine("\n== EXPENSES ==");
//   expenses.forEach((e) => {
//     writeLine(`${e.description}: Php${e.amount}`);
//   });

//   writeLine("\n== SUMMARY ==");
//   summary.forEach((s) => {
//     writeLine(
//       `${s.monthLabel} - Earnings: Php${s.totalEarnings}, Expenses: Php${s.totalExpenses}`
//     );
//   });

//   return await pdfDoc.save();
// }

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
import Papa from "https://esm.sh/papaparse@5.4.1";
import dayjs from "https://esm.sh/dayjs@1.11.10";
import utc from "https://esm.sh/dayjs@1.11.10/plugin/utc.js";
import { Resend } from "https://esm.sh/resend";

// Enable UTC plugin
dayjs.extend(utc);

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Determine current quarter
    const now = new Date();
    let year = now.getFullYear();
    const month = now.getMonth() + 1;

    let startMonth = 1;
    let endMonth = 3;

    if (month === 4) {
      startMonth = 1;
      endMonth = 3;
    } else if (month === 7) {
      startMonth = 4;
      endMonth = 6;
    } else if (month === 10) {
      startMonth = 7;
      endMonth = 9;
    } else if (month === 1) {
      startMonth = 10;
      endMonth = 12;
      year -= 1;
    } else {
      return new Response("Not a scheduled archive month", { status: 400 });
    }

    // Format time using Supabase-friendly format
    const rawFrom = dayjs.utc(
      `${year}-${String(startMonth).padStart(2, "0")}-01`
    );
    const rawTo = dayjs
      .utc(`${year}-${String(endMonth).padStart(2, "0")}-01`)
      .endOf("month")
      .endOf("day");

    const from = rawFrom.format("YYYY-MM-DD HH:mm:ss");
    const to = rawTo.format("YYYY-MM-DD HH:mm:ss");
    const subjectDateLabel = `${rawFrom.format(
      "MMMM D, YYYY"
    )} to ${rawTo.format("MMMM D, YYYY")}`;

    console.log("🗓️ Filtering From:", from);
    console.log("🗓️ Filtering To:", to);

    // Fetch rental and expense data
    const { data: rentals, error: rentalError } = await supabase
      .from("Rental")
      .select("*")
      .gte("pickupDate", from)
      .lte("pickupDate", to);

    if (rentalError) throw rentalError;

    const { data: expenses, error: expenseError } = await supabase
      .from("Expense")
      .select("*")
      .gte("createdAt", from)
      .lte("createdAt", to);

    if (expenseError) throw expenseError;

    console.log(`📦 Rentals fetched: ${rentals.length}`);
    console.log(`📦 Expenses fetched: ${expenses.length}`);

    // Generate earnings/expenses summary
    const paymentModes = [
      "GCASH",
      "Maya",
      "GoTyme",
      "BPI",
      "BDO",
      "UnionBank",
      "Metrobank",
      "Cash",
    ];
    const summary = [];
    const monthMap: Record<string, any> = {};

    rentals.forEach((r) => {
      const key = new Date(r.pickupDate).toISOString().slice(0, 7);
      if (!monthMap[key]) {
        monthMap[key] = {
          monthLabel: dayjs(r.pickupDate).format("MMMM YYYY"),
          totalEarnings: 0,
          totalExpenses: 0,
          breakdown: Object.fromEntries(
            paymentModes.map((m) => [m, { earnings: 0, expenses: 0 }])
          ),
        };
      }
      if (r.downPaymentMode) {
        const amt = Number(r.downPayment || 0);
        monthMap[key].breakdown[r.downPaymentMode].earnings += amt;
        monthMap[key].totalEarnings += amt;
      }
      if (r.finalPaymentMode) {
        const amt = Number(r.finalPayment || 0);
        monthMap[key].breakdown[r.finalPaymentMode].earnings += amt;
        monthMap[key].totalEarnings += amt;
      }
    });

    expenses.forEach((e) => {
      const key = new Date(e.createdAt).toISOString().slice(0, 7);
      if (!monthMap[key]) {
        monthMap[key] = {
          monthLabel: dayjs(e.createdAt).format("MMMM YYYY"),
          totalEarnings: 0,
          totalExpenses: 0,
          breakdown: Object.fromEntries(
            paymentModes.map((m) => [m, { earnings: 0, expenses: 0 }])
          ),
        };
      }
      if (e.paymentMode) {
        const amt = Number(e.amount || 0);
        monthMap[key].breakdown[e.paymentMode].expenses += amt;
        monthMap[key].totalExpenses += amt;
      }
    });

    summary.push(...Object.values(monthMap));

    // Generate CSVs
    const csvRentals = Papa.unparse(rentals);
    const csvExpenses = Papa.unparse(expenses);
    const csvSummary = Papa.unparse(
      summary.map((item) => ({
        month: item.monthLabel,
        ...Object.fromEntries(
          Object.entries(item.breakdown).flatMap(([mode, val]) => [
            [`${mode}_earnings`, val.earnings],
            [`${mode}_expenses`, val.expenses],
          ])
        ),
        totalEarnings: item.totalEarnings,
        totalExpenses: item.totalExpenses,
      }))
    );

    // Generate PDF
    const pdfBuffer = await createPdfReport(rentals, expenses, summary);

    // Send email
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
    await resend.emails.send({
      from: "Keith's Gown Rental <onboarding@resend.dev>",
      to: "kitkat.miel.pineda@gmail.com",
      subject: `Quarterly Report - ${subjectDateLabel}`,
      html: "<p>Attached are the quarterly rental, expenses, and summary reports.</p>",
      attachments: [
        {
          filename: "rentals.csv",
          content: btoa(unescape(encodeURIComponent(csvRentals))),
        },
        {
          filename: "expenses.csv",
          content: btoa(unescape(encodeURIComponent(csvExpenses))),
        },
        {
          filename: "summary.csv",
          content: btoa(unescape(encodeURIComponent(csvSummary))),
        },
        {
          filename: "summary.pdf",
          content: btoa(String.fromCharCode(...new Uint8Array(pdfBuffer))),
        },
      ],
    });

    // 🔥 Delete old records (with .select())
    const {
      data: deletedRentals,
      count: rentalCount,
      error: deleteRentalError,
    } = await supabase
      .from("Rental")
      .delete()
      .gte("pickupDate", from)
      .lte("pickupDate", to)
      .select("*", { count: "exact" });

    const {
      data: deletedExpenses,
      count: expenseCount,
      error: deleteExpenseError,
    } = await supabase
      .from("Expense")
      .delete()
      .gte("createdAt", from)
      .lte("createdAt", to)
      .select("*", { count: "exact" });

    console.log("Deleted Rentals:", deletedRentals);
    console.log("Deleted Expenses:", deletedExpenses);

    if (deleteRentalError || deleteExpenseError) {
      console.error("❌ Deletion error details:");
      if (deleteRentalError) {
        console.error("Rental Delete Error:", deleteRentalError.message);
      }
      if (deleteExpenseError) {
        console.error("Expense Delete Error:", deleteExpenseError.message);
      }

      // 👇 Optional: include specific error in thrown message
      throw new Error(
        `Deletion failed: ${deleteRentalError?.message || ""} ${
          deleteExpenseError?.message || ""
        }`
      );
    }

    console.log(`🧹 Deleted Rentals: ${rentalCount}`);
    console.log(`🧹 Deleted Expenses: ${expenseCount}`);

    return new Response("✅ Email sent and data deleted!", { status: 200 });
  } catch (err) {
    console.error("❌ Error in function:", err);
    return new Response(`Error occurred: ${err?.message || err?.toString()}`, {
      status: 500,
    });
  }
});

// PDF helper
async function createPdfReport(
  rentals: any[],
  expenses: any[],
  summary: any[]
) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 50;
  const lineHeight = fontSize + 5;
  let y = height - margin;

  const writeLine = (text: string) => {
    if (y < margin + lineHeight) {
      page.drawText("--- Page Overflow ---", {
        x: margin,
        y: margin,
        size: fontSize,
        font,
        color: rgb(1, 0, 0),
      });
      return;
    }
    page.drawText(text, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  writeLine("*** Quarterly Report ***\n");

  writeLine("== RENTALS ==");
  rentals.forEach((r) =>
    writeLine(`${r.name} | Pickup: ${dayjs(r.pickupDate).format("MMM D")}`)
  );

  writeLine("\n== EXPENSES ==");
  expenses.forEach((e) => writeLine(`${e.description}: Php${e.amount}`));

  writeLine("\n== SUMMARY ==");
  summary.forEach((s) => {
    writeLine(
      `${s.monthLabel} - Earnings: Php${s.totalEarnings}, Expenses: Php${s.totalExpenses}`
    );
  });

  return await pdfDoc.save();
}
