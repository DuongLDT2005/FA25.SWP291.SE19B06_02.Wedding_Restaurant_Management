import Hero from "./Hero";
import SearchSection from "../../components/searchbar/SearchSection";
import { SearchProvider } from "../../context/SearchContext";
import WardCards from "./WardCards";
// import EventTypes from "@/components/event-types"
// import RestaurantPromotions from "@/components/restaurant-promotions"
// import TopRestaurants from "@/components/top-restaurants"
import MainLayout from "../../layouts/MainLayout"
export default function LandingPage() {
    return (
        <div>
            <MainLayout>
                <Hero />
                <SearchProvider>
                    <SearchSection />
                </SearchProvider>
                <main className="container mx-auto px-4 py-12 space-y-12">
                    <WardCards />
                    {/* <RestaurantPromotions />
                    <EventTypes />
                    <TopRestaurants /> */}
                </main>
            </MainLayout>
        </div>
    )
}
