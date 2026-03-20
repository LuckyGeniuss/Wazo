import { NextRequest, NextResponse } from "next/server";
import { trackAdImpression, trackAdClick } from "@/actions/superadmin/monetization";
import { AdPlacement } from "@prisma/client";

/**
 * API endpoint для відстеження реклами
 * 
 * POST /api/ads/track
 * Body: {
 *   campaignId: string;
 *   placement: AdPlacement;
 *   type: 'impression' | 'click';
 *   storeId?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, placement, type, storeId, userId } = body;

    if (!campaignId || !placement || !type) {
      return NextResponse.json(
        { error: "Missing required fields: campaignId, placement, type" },
        { status: 400 }
      );
    }

    // Перевірка валідності placement
    const validPlacements: AdPlacement[] = [
      "MARKETPLACE_HEADER",
      "MARKETPLACE_SIDEBAR",
      "STOREFRONT_HEADER",
      "STOREFRONT_SIDEBAR",
      "PRODUCT_DETAIL",
      "CATEGORY_PAGE",
      "CHECKOUT_PAGE",
      "SEARCH_RESULTS",
    ];

    if (!validPlacements.includes(placement as AdPlacement)) {
      return NextResponse.json(
        { error: "Invalid placement value" },
        { status: 400 }
      );
    }

    if (type === "impression") {
      const result = await trackAdImpression(
        campaignId,
        placement as AdPlacement,
        storeId,
        userId
      );

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: result.data });
    }

    if (type === "click") {
      const result = await trackAdClick(
        campaignId,
        placement as AdPlacement,
        storeId,
        userId
      );

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid type. Must be 'impression' or 'click'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error tracking ad:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET запит для перевірки доступності API
 */
export async function GET() {
  return NextResponse.json({ status: "ok", message: "Ad tracking API is running" });
}
