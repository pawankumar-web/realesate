<?php

namespace Database\Seeders;

use App\Models\Amenity;
use App\Models\BlogPost;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Review;
use App\Models\User;
use App\Models\Vendor;
use App\Models\Booking;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $driver = \DB::getDriverName();
        if ($driver === 'mysql') {
            \DB::statement('SET FOREIGN_KEY_CHECKS=0');
        }
        \App\Models\PropertyImage::truncate();
        \App\Models\Review::truncate();
        \App\Models\Booking::truncate();
        if ($driver === 'pgsql') {
            \DB::statement('TRUNCATE TABLE property_amenity RESTART IDENTITY CASCADE');
        } else {
            \DB::table('property_amenity')->truncate();
        }
        \App\Models\Property::truncate();
        \App\Models\BlogPost::truncate();
        if ($driver === 'mysql') {
            \DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }

        $this->createVendors();
        $this->createProperties();
        $this->createBlogPosts();
    }

    private function createVendors(): array
    {
        $vendorsData = [
            ['name' => 'Arjun Mehta', 'company' => 'Luxury Estates India', 'city' => 'Mumbai'],
            ['name' => 'Priya Sharma', 'company' => 'Premier Homes Realty', 'city' => 'Bangalore'],
            ['name' => 'Vikram Singh', 'company' => 'Royal Properties', 'city' => 'Delhi'],
            ['name' => 'Neha Patel', 'company' => 'Gokul Realtors', 'city' => 'Pune'],
            ['name' => 'Rajesh Kumar', 'company' => 'Apex Realty Partners', 'city' => 'Hyderabad'],
            ['name' => 'Ananya Reddy', 'company' => 'Brigade Estates', 'city' => 'Chennai'],
            ['name' => 'Rahul Verma', 'company' => 'DLF Realty', 'city' => 'Gurgaon'],
            ['name' => 'Kavita Joshi', 'company' => 'Prestige Estates', 'city' => 'Bangalore'],
            ['name' => 'Suresh Nair', 'company' => 'Godrej Properties', 'city' => 'Mumbai'],
            ['name' => 'Deepika Gupta', 'company' => 'Tata Housing', 'city' => 'Pune'],
        ];

        $vendors = [];
        foreach ($vendorsData as $i => $data) {
            $email = strtolower(str_replace(' ', '.', $data['name'])) . '@realesate.com';
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $data['name'],
                    'phone' => '98' . str_pad((string)($i + 10000000), 8, '0', STR_PAD_LEFT),
                    'password' => Hash::make('password'),
                    'role' => 'vendor',
                    'email_verified_at' => now(),
                    'status' => 'active',
                ]
            );

            $vendor = Vendor::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => $data['company'],
                    'gst_no' => '27AAACH' . str_pad((string)($i + 1), 5, '0', STR_PAD_LEFT) . 'M1Z',
                    'pan_no' => 'AAACH' . str_pad((string)($i + 1), 5, '0', STR_PAD_LEFT),
                    'business_address' => $data['city'] . ', India',
                    'kyc_status' => 'approved',
                    'is_verified' => $i < 8,
                    'commission_rate' => rand(150, 300) / 100,
                    'approved_at' => now(),
                ]
            );

            // Update existing vendor if needed
            if (!$vendor->wasRecentlyCreated) {
                $vendor->update([
                    'company_name' => $data['company'],
                    'is_verified' => $i < 8,
                ]);
            }

            $vendors[] = ['user' => $user, 'vendor' => $vendor];
        }

        return $vendors;
    }

    private function createProperties(): void
    {
        $vendors = User::where('role', 'vendor')->with('vendor')->get();
        $amenities = Amenity::all();

        $propertiesData = [
            ['Sea View Penthouse', 85000000, 'buy', 'apartment', '4 BHK', 3200, 4, 4, 'full', 'Mumbai', 19.0760, 72.8777, true],
            ['Modern 3BHK Worli', 32000000, 'buy', 'apartment', '3 BHK', 1850, 3, 3, 'full', 'Mumbai', 19.0183, 72.8463, true],
            ['Luxury Villa Juhu', 120000000, 'buy', 'villa', '5 BHK', 5200, 5, 5, 'full', 'Mumbai', 19.0989, 72.8329, false],
            ['Tech Park 2BHK Whitefield', 8500000, 'buy', 'apartment', '2 BHK', 1200, 2, 2, 'semi', 'Bangalore', 12.9698, 77.7500, true],
            ['Premium Villa Electronic City', 18000000, 'buy', 'villa', '3 BHK', 2400, 3, 3, 'full', 'Bangalore', 12.8399, 77.6770, false],
            ['Luxury 4BHK Dwarka', 25000000, 'buy', 'apartment', '4 BHK', 2200, 4, 3, 'full', 'Delhi', 28.5833, 77.0333, true],
            ['Modern Apartment Saket', 15000000, 'buy', 'apartment', '3 BHK', 1600, 3, 2, 'semi', 'Delhi', 28.5176, 77.2087, false],
            ['3BHK Hinjewadi', 6500000, 'buy', 'apartment', '3 BHK', 1350, 3, 2, 'semi', 'Pune', 18.6033, 73.7387, true],
            ['Villa Baner', 9500000, 'buy', 'villa', '3 BHK', 2000, 3, 3, 'full', 'Pune', 18.5582, 73.7867, false],
            ['Luxury Apartment HITEC City', 12000000, 'buy', 'apartment', '3 BHK', 1650, 3, 2, 'full', 'Hyderabad', 17.4281, 78.3484, true],
            ['4BHK Villa Jubilee Hills', 35000000, 'buy', 'villa', '4 BHK', 3800, 4, 4, 'full', 'Hyderabad', 17.4319, 78.4176, false],
            ['3BHK DLF Phase 2', 28000000, 'buy', 'apartment', '3 BHK', 1950, 3, 3, 'full', 'Gurgaon', 28.4843, 77.0889, true],
            ['Studio Cyber City', 4500000, 'rent', 'apartment', '1 BHK', 650, 1, 1, 'full', 'Gurgaon', 28.4933, 77.0900, false],
            ['2BHK OMR Chennai', 6500000, 'buy', 'apartment', '2 BHK', 1100, 2, 2, 'semi', 'Chennai', 12.9180, 80.2275, true],
            ['Beach House ECR', 42000000, 'buy', 'villa', '4 BHK', 3500, 4, 4, 'full', 'Chennai', 12.7594, 80.2477, false],
            ['Luxury Villa Goa', 65000000, 'buy', 'villa', '5 BHK', 4500, 5, 5, 'full', 'Goa', 15.4909, 73.8278, true],
            ['3BHK Salt Lake City', 45000000, 'buy', 'apartment', '3 BHK', 1400, 3, 2, 'semi', 'Kolkata', 22.5844, 88.4109, false],
            ['Modern Apartment SG Highway', 5500000, 'buy', 'apartment', '2 BHK', 1250, 2, 2, 'full', 'Ahmedabad', 23.0225, 72.5714, false],
            ['Villa Vaishali Nagar', 8500000, 'buy', 'villa', '3 BHK', 2200, 3, 2, 'full', 'Jaipur', 26.9124, 75.7873, false],
            ['2BHK Sector 15', 5000000, 'buy', 'apartment', '2 BHK', 1050, 2, 2, 'semi', 'Chandigarh', 30.7333, 76.7794, false],
            ['Luxury Penthouse Andheri', 28000000, 'buy', 'apartment', '4 BHK', 2800, 4, 3, 'full', 'Mumbai', 19.1130, 72.8370, true],
            ['Garden Villa Whitefield', 22000000, 'buy', 'villa', '4 BHK', 3100, 4, 3, 'full', 'Bangalore', 12.9716, 77.6414, false],
            ['1BHK HSR Layout', 3500000, 'rent', 'apartment', '1 BHK', 700, 1, 1, 'full', 'Bangalore', 12.9116, 77.6389, false],
            ['Studio Powai', 2800000, 'rent', 'apartment', '1 BHK', 550, 1, 1, 'full', 'Mumbai', 19.1149, 72.8919, false],
            ['Commercial Office BKC', 50000000, 'buy', 'commercial', null, 2500, 0, 2, 'full', 'Mumbai', 19.0623, 72.8732, true],
            ['Retail Space CP Delhi', 22000000, 'buy', 'commercial', null, 1200, 0, 1, 'full', 'Delhi', 28.6329, 77.2198, false],
        ];

        $propertyImages = [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18f6b5af2?w=800&q=80',
            'https://images.unsplash.com/photo-1600573472556-e636ea9f07e6?w=800&q=80',
            'https://images.unsplash.com/photo-1600586156422-9c2d1b0b83ff?w=800&q=80',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
            'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80',
            'https://images.unsplash.com/photo-1600573472591-ee6c68b14d3e?w=800&q=80',
        ];

        $states = [
            'Mumbai' => 'Maharashtra', 'Bangalore' => 'Karnataka', 'Delhi' => 'Delhi',
            'Pune' => 'Maharashtra', 'Hyderabad' => 'Telangana', 'Chennai' => 'Tamil Nadu',
            'Gurgaon' => 'Haryana', 'Goa' => 'Goa', 'Kolkata' => 'West Bengal',
            'Ahmedabad' => 'Gujarat', 'Jaipur' => 'Rajasthan', 'Chandigarh' => 'Chandigarh',
        ];

        foreach ($propertiesData as $i => $data) {
            [$title, $price, $purpose, $type, $bhk, $area, $beds, $baths, $furnished, $city, $lat, $lng, $featured] = $data;

            $vendor = $vendors[$i % count($vendors)];

            $descriptions = [
                "Welcome to **$title**, an exquisite $type located in the heart of $city. This meticulously designed property offers unparalleled luxury and comfort with premium finishes throughout. Step into a world of sophistication where every detail has been carefully curated for the discerning buyer.\n\nThe property features spacious living areas with abundant natural light, a modern kitchen with top-of-the-line appliances, and luxurious bedrooms with en-suite bathrooms. The master suite includes a walk-in closet and a spa-like bathroom with a soaking tub and rain shower.\n\nResidents enjoy access to world-class amenities including a state-of-the-art fitness center, swimming pool, landscaped gardens, and 24/7 concierge service. With its prime location, this property offers easy access to schools, hospitals, shopping centers, and entertainment venues.",
                "Discover **$title** in $city — a stunning $type that redefines modern living. Featuring spacious layouts, top-of-the-line fixtures, and breathtaking views, this property represents the pinnacle of urban luxury.\n\nThe open-plan design seamlessly blends indoor and outdoor living, with large windows that flood the interiors with natural light. The gourmet kitchen is equipped with premium appliances, while the bedrooms offer tranquil retreats with plush carpeting and custom closets.\n\nThis exclusive property comes with premium amenities including a rooftop terrace, private garden, dedicated parking, and round-the-clock security. Located in one of $city's most desirable neighborhoods, everything you need is just moments away.",
                "Presenting **$title**, an exceptional $type nestled in the most sought-after neighborhood of $city. This architectural masterpiece boasts soaring ceilings, floor-to-ceiling windows, and exquisite craftsmanship throughout.\n\nEvery inch of this property has been designed with luxury and comfort in mind. The grand living room features a stunning chandelier and marble flooring, while the formal dining room is perfect for entertaining guests. The state-of-the-art kitchen features custom cabinetry and premium stainless steel appliances.\n\nBeyond the interiors, residents enjoy a host of premium amenities including a temperature-controlled swimming pool, fully equipped gym, children's play area, and beautifully manicured gardens. Experience the perfect harmony of style and functionality.",
            ];

            $reraNumber = 'RERA/UPRERA/' . now()->year . '/' . str_pad((string)rand(100000, 999999), 6, '0', STR_PAD_LEFT);
            $possessionDate = now()->addMonths(rand(3, 24))->format('M Y');
            $buildersList = ['Godrej Properties', 'DLF Ltd.', 'Prestige Group', 'Brigade Group', 'Lodha Group', 'Oberoi Realty', 'Sobha Ltd.', 'Tata Housing', 'Piramal Realty', 'Hiranandani Group'];
            $builderName = $buildersList[$i % count($buildersList)];

            $property = Property::create([
                'user_id' => $vendor->id,
                'title' => $title,
                'slug' => Str::slug($title) . '-' . Str::random(8),
                'description' => $descriptions[$i % 3],
                'price' => $price,
                'discount_price' => $featured ? (int)($price * 0.95) : null,
                'purpose' => $purpose,
                'property_type' => $type,
                'bhk' => $bhk,
                'area_sqft' => $area,
                'bedrooms' => $beds,
                'bathrooms' => $baths,
                'furnished_status' => $furnished,
                'property_age' => rand(0, 10),
                'ownership_type' => ['freehold', 'leasehold', 'cooperative'][array_rand(['freehold', 'leasehold', 'cooperative'])],
                'floors' => $type === 'apartment' ? rand(1, 20) : rand(1, 2),
                'parking' => $beds >= 3 ? rand(1, 2) : rand(0, 1),
                'balcony' => rand(0, 1),
                'address' => "$title, $city",
                'city' => $city,
                'state' => $states[$city] ?? 'Maharashtra',
                'zip_code' => str_pad((string)rand(100001, 999999), 6, '0', STR_PAD_LEFT),
                'lat' => round($lat + (rand(-100, 100) / 1000), 7),
                'lng' => round($lng + (rand(-100, 100) / 1000), 7),
                'status' => 'approved',
                'is_featured' => $featured,
                'is_verified' => $vendor->vendor->is_verified,
                'views' => rand(50, 2000),
                'meta_description' => json_encode([
                    'rera' => $reraNumber,
                    'possession' => $possessionDate,
                    'builder' => $builderName,
                ]),
            ]);

            $imageCount = rand(3, 5);
            for ($j = 0; $j < $imageCount; $j++) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $propertyImages[array_rand($propertyImages)],
                    'is_primary' => $j === 0,
                    'sort_order' => $j,
                ]);
            }

            $randomAmenities = $amenities->random(rand(3, 6));
            $property->amenities()->attach($randomAmenities->pluck('id')->toArray());
        }

        $buyer = User::where('email', 'user@realesate.com')->first();
        if ($buyer) {
            $approvedProperties = Property::where('status', 'approved')->get();
            foreach ($approvedProperties->random(min(3, $approvedProperties->count())) as $prop) {
                Review::create([
                    'user_id' => $buyer->id,
                    'property_id' => $prop->id,
                    'rating' => rand(3, 5),
                    'review' => 'Excellent property with great amenities and location. The builder has delivered quality construction as promised. Highly recommended for families looking for a premium living experience.',
                    'status' => 'approved',
                ]);
            }
            foreach ($approvedProperties->random(min(2, $approvedProperties->count())) as $prop) {
                Booking::create([
                    'user_id' => $buyer->id,
                    'property_id' => $prop->id,
                    'visit_date' => now()->addDays(rand(1, 14))->format('Y-m-d'),
                    'visit_time' => ['10:00', '11:00', '14:00', '15:00', '16:00'][array_rand(['10:00', '11:00', '14:00', '15:00', '16:00'])],
                    'status' => ['pending', 'confirmed', 'completed'][array_rand(['pending', 'confirmed', 'completed'])],
                    'notes' => 'Looking forward to visiting this property.',
                ]);
            }
        }
    }

    private function createBlogPosts(): void
    {
        $adminUser = User::where('email', 'admin@realesate.com')->first();
        if (!$adminUser) return;

        $blogs = [
            [
                'slug' => '2026-real-estate-market-trends',
                'title' => '2026 Real Estate Market Trends: What Buyers & Sellers Need to Know',
                'content' => "The real estate market in 2026 is experiencing a significant transformation driven by technological advancements, changing demographics, and evolving lifestyle preferences. Interest rates have stabilized after the volatility of previous years, creating a more predictable environment for both buyers and sellers.\n\nOne of the most notable trends is the rise of secondary cities as primary investment destinations. With remote work becoming permanent for many professionals, there has been a substantial migration from expensive metropolitan areas to more affordable regions that offer better quality of life.\n\nInventory levels are gradually improving, giving buyers more options than they have had in recent years. However, the market remains competitive for well-priced properties in desirable locations. Sellers who invest in staging and smart home upgrades are seeing faster sales and higher offers.\n\nSustainability continues to be a major factor, with energy-efficient homes commanding premium prices. Properties with solar panels, smart energy management systems, and sustainable materials are particularly attractive to the growing segment of environmentally conscious buyers.",
                'category' => 'Market Trends',
                'excerpt' => 'An in-depth analysis of the shifting dynamics in the real estate market for 2026, covering interest rates, inventory levels, and emerging neighborhood hotspots.',
            ],
            [
                'slug' => 'first-time-home-buyer-guide',
                'title' => 'The Ultimate First-Time Home Buyer Guide: 10 Steps to Your Dream Home',
                'content' => "Buying your first home is one of the most exciting and significant financial decisions you will ever make. This comprehensive guide walks you through every step of the process, ensuring you are well-prepared for this milestone.\n\nStep 1: Assess Your Finances\nBefore you start looking at properties, take a close look at your financial situation. Calculate your debt-to-income ratio, review your credit score, and determine how much you can afford for a down payment.\n\nStep 2: Get Pre-Approved\nA mortgage pre-approval gives you a clear picture of your budget and shows sellers that you are a serious buyer. Shop around with different lenders to find the best rates and terms.\n\nStep 3: Define Your Priorities\nMake a list of must-haves versus nice-to-haves. Consider location, commute times, school districts, and the type of property that best suits your lifestyle.\n\nStep 4: Find a Real Estate Agent\nA good agent is invaluable, especially for first-time buyers. Look for someone with experience in your target area and a track record of helping first-time buyers navigate the process.",
                'category' => 'Buying Guide',
                'excerpt' => 'Everything you need to know before making your first property purchase, from mortgage pre-approval to closing the deal.',
            ],
            [
                'slug' => 'maximize-home-selling-price',
                'title' => '10 Proven Strategies to Maximize Your Home Selling Price',
                'content' => "Selling your home for the best possible price requires strategy, preparation, and smart marketing. Here are ten proven strategies that can help you maximize your sale price.\n\n1. Curb Appeal Matters\nFirst impressions are everything. Invest in landscaping, a fresh coat of paint for the front door, and ensure the exterior is immaculate.\n\n2. Professional Staging\nStaged homes sell 73% faster and often at higher prices. Professional staging helps buyers envision themselves living in the space.\n\n3. High-Quality Photography\nIn today's digital world, your listing photos are the first thing potential buyers see. Invest in professional photography that showcases your home in the best light.\n\n4. Price It Right\nOverpricing can lead to your home sitting on the market, which can actually reduce its perceived value. Work with your agent to set a competitive price.\n\n5. Make Strategic Upgrades\nFocus on upgrades that offer the best return on investment: kitchen and bathroom updates, fresh paint, and flooring improvements typically yield the highest returns.",
                'category' => 'Selling Tips',
                'excerpt' => 'Learn the most effective techniques to increase your property value and attract the right buyers in any market condition.',
            ],
            [
                'slug' => 'real-estate-investment-2026',
                'title' => 'Where to Invest in Real Estate in 2026: Top Emerging Markets',
                'content' => "Real estate investment in 2026 offers exciting opportunities across emerging markets. As traditional hubs become increasingly expensive, savvy investors are looking to secondary cities and developing neighborhoods for higher returns.\n\nTier-2 cities like Pune, Ahmedabad, and Jaipur are experiencing remarkable growth thanks to improving infrastructure, affordable housing, and a growing IT presence. These markets offer lower entry prices and higher rental yields compared to metropolitan areas.\n\nCommercial real estate in suburban office parks and co-working spaces continues to thrive as hybrid work models persist. Industrial and logistics properties remain strong performers due to the continued growth of e-commerce.\n\nFor residential investments, properties with smart home features, energy efficiency, and community amenities are outperforming traditional homes. The key is to identify neighborhoods with strong fundamentals: job growth, infrastructure development, and population influx.",
                'category' => 'Investment',
                'excerpt' => 'Discover the most promising real estate markets for investment this year, with data-driven insights and expert predictions.',
            ],
            [
                'slug' => 'biophilic-interior-design-trends',
                'title' => 'Biophilic Design: Bringing Nature Into Your Modern Home',
                'content' => "Biophilic design is transforming modern homes by incorporating natural elements into the built environment. This approach goes beyond simply adding plants — it creates a deep connection between occupants and nature.\n\nThe core principles of biophilic design include natural light, organic materials, living walls, water features, and seamless indoor-outdoor transitions. Homes designed with these principles in mind have been shown to reduce stress, improve cognitive function, and enhance overall well-being.\n\nKey elements include floor-to-ceiling windows that flood spaces with natural light, use of wood and stone materials, indoor gardens, and outdoor living spaces that extend the usable area of the home. Natural color palettes inspired by landscapes create calming environments.\n\nAs more homebuyers prioritize wellness, properties incorporating biophilic design principles command premium prices and sell faster than conventional homes.",
                'category' => 'Interior Design',
                'excerpt' => 'Explore how biophilic interior design is transforming modern homes and why it is becoming the most sought-after aesthetic.',
            ],
            [
                'slug' => 'legal-checklist-property-purchase',
                'title' => 'Essential Legal Checklist for Property Purchase in 2026',
                'content' => "Purchasing property involves complex legal procedures that require careful attention. This checklist covers the essential legal aspects you need to verify before finalizing any property transaction.\n\nTitle Deed Verification\nEnsure the seller has clear and marketable title to the property. Verify the chain of ownership and check for any encumbrances, liens, or disputes.\n\nEncumbrance Certificate\nThis document certifies that the property is free from any legal or financial liabilities. Obtain it from the sub-registrar's office for the last 15-30 years.\n\nApproved Building Plan\nVerify that the property's construction follows the approved building plan and that all necessary approvals from the municipal corporation are in place.\n\nTax Receipts\nEnsure all property taxes, maintenance charges, and other dues have been paid up to date by the seller.\n\nSale Agreement\nHave a qualified lawyer review the sale agreement before signing. Pay attention to payment terms, possession date, and dispute resolution clauses.",
                'category' => 'Legal',
                'excerpt' => 'A comprehensive guide to the legal documentation, due diligence, and compliance requirements for buying property.',
            ],
            [
                'slug' => 'smart-home-technology-value',
                'title' => 'How Smart Home Technology Adds Value to Your Property',
                'content' => "Smart home technology has evolved from a luxury novelty to a significant value-add for modern properties. As technology becomes more accessible and homeowners prioritize convenience and efficiency, smart features increasingly influence purchasing decisions.\n\nThe most valuable smart home features include automated lighting systems that can be controlled remotely, smart thermostats that optimize energy usage, and advanced security systems with video doorbells and smart locks. These features not only enhance daily living but also contribute to energy savings — a major selling point for environmentally conscious buyers.\n\nWhole-home automation systems that integrate lighting, climate control, entertainment, and security through a single interface are particularly attractive. Properties with such systems can command 3-5% higher prices and spend less time on the market.\n\nWhen installing smart home technology, focus on systems that are compatible with major platforms like Google Home, Amazon Alexa, or Apple HomeKit. This ensures future compatibility and broader buyer appeal.",
                'category' => 'Market Trends',
                'excerpt' => 'From automated lighting to security systems, discover which smart home features give you the best return on investment.',
            ],
            [
                'slug' => 'staging-tips-quick-sale',
                'title' => 'Home Staging Tips That Will Sell Your Property Faster',
                'content' => "Professional home staging is one of the most effective tools in real estate marketing. Staged homes not only sell faster but often command higher prices. Here are expert tips to stage your property effectively.\n\nDeclutter and Depersonalize\nRemove personal items, family photos, and excess furniture. Buyers need to envision themselves in the space, which is difficult when it's filled with someone else's belongings.\n\nFocus on Key Rooms\nPriority should be given to the living room, master bedroom, and kitchen — these rooms have the most influence on buyer decisions. Ensure these spaces are spacious, clean, and inviting.\n\nUse Neutral Colors\nA neutral color palette appeals to the widest range of buyers. If your walls are painted in bold colors, consider repainting in soft neutrals like beige, gray, or warm white.\n\nMaximize Natural Light\nOpen curtains and blinds, clean windows, and add mirrors to reflect light. Bright, well-lit spaces feel larger and more welcoming.\n\nAdd Finishing Touches\nFresh flowers, decorative pillows, ambient lighting, and subtle artwork can make a space feel warm and lived-in without being cluttered.",
                'category' => 'Selling Tips',
                'excerpt' => 'Professional staging secrets that can help your home sell up to 73% faster and often at a higher price.',
            ],
            [
                'slug' => 'rental-property-passive-income',
                'title' => 'Building Passive Income Through Rental Properties: A Beginner\'s Guide',
                'content' => "Rental property investment remains one of the most reliable paths to building long-term wealth. This guide covers the fundamentals of starting your rental property portfolio.\n\nChoosing the Right Property\nLocation is paramount when investing in rental properties. Look for areas with strong job growth, good schools, low crime rates, and access to public transportation. Properties near universities and hospitals tend to have consistent rental demand.\n\nFinancing Your Investment\nExplore different financing options including conventional mortgages, FHA loans, and portfolio loans. Your down payment and interest rate will significantly impact your cash flow.\n\nCalculating Returns\nUnderstand key metrics like cap rate, cash-on-cash return, and gross rent multiplier. A good rental property should generate positive cash flow after accounting for mortgage, taxes, insurance, maintenance, and property management fees.\n\nProperty Management\nDecide whether to self-manage or hire a professional property management company. While self-management saves money, professional management can save time and reduce stress, especially if you own multiple properties.\n\nBuilding a Portfolio\nStart with one property, learn the ropes, and gradually expand. Many successful investors follow the BRRRR strategy: Buy, Rehab, Rent, Refinance, Repeat.",
                'category' => 'Investment',
                'excerpt' => "Start your journey to financial freedom with this comprehensive guide to rental property investment and management.",
            ],
        ];

        foreach ($blogs as $b) {
            BlogPost::updateOrCreate(
                ['slug' => $b['slug']],
                [
                    'author_id' => $adminUser->id,
                    'title' => $b['title'],
                    'content' => $b['content'],
                    'excerpt' => $b['excerpt'],
                    'featured_image' => null,
                    'tags' => [$b['category']],
                    'status' => 'published',
                    'published_at' => now()->subDays(rand(1, 30)),
                ]
            );
        }
    }
}
