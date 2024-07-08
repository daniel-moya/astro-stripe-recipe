import type { APIRoute } from 'astro'
export const prerender = false;
import { Stripe } from "stripe";

export const POST: APIRoute = async ({ request }) => {
	const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!);

	const body = await request.text();
	const signature = request.headers.get('stripe-signature')

	let event;
	try {
		event = stripe.webhooks.constructEvent(body, signature!, import.meta.env.STRIPE_WEBHOOK_SECRET!)
	} catch (error: any) {
		console.error(error)
		return new Response(JSON.stringify({}), {
			status: 400,
		})
	}

	if (event.type === "checkout.session.completed") {
		console.log("Send email with product", event.data.object);
	}

	return new Response(JSON.stringify({
		data: body
	}), {
		status: 200
	})
}

