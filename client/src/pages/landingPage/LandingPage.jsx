import Hero from "./Hero";
import SearchSection from "../../components/searchbar/SearchSection";
import WardCards from "./WardCards";
import EventTypesSection from "./EventTypeSection";
// import RestaurantPromotions from "@/components/restaurant-promotions"
// import TopRestaurants from "@/components/top-restaurants"
import MainLayout from "../../layouts/LandingPageLayout"
export default function LandingPage() {
    return (
        <div>
            <MainLayout>
                <Hero />
                <SearchSection />
                <main className="container mx-auto px-4 py-12 space-y-12">
                    <WardCards />
                    <EventTypesSection />
                    {/* <RestaurantPromotions />
                    <EventTypes />
                    <TopRestaurants /> */}
                </main>
            </MainLayout>
        </div>
    )
}
