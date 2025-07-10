import { storage } from "./storage";

export async function seedBusinessIntelligenceData() {
  try {
    // Create a test user profile
    const userProfile = await storage.createUserProfile({
      email: "john.doe@realestate.com",
      fullName: "John Doe", 
      companyName: "Elite Property Management",
      role: "Asset Manager",
      phone: "+1-555-0123"
    });

    console.log("Created user profile:", userProfile.id);

    // Create sample properties
    const property1 = await storage.createUserProperty({
      userId: userProfile.id,
      name: "Riverside Commons",
      address: "123 River St, Austin TX 78701",
      units: 150,
      tier: "professional",
      pmSoftware: "AppFolio",
      paymentMethod: "ach",
      monthlyCost: "22500.00" // 150 units * $150/unit
    });

    const property2 = await storage.createUserProperty({
      userId: userProfile.id,
      name: "Downtown Plaza",
      address: "456 Main St, Austin TX 78702", 
      units: 200,
      tier: "enterprise",
      pmSoftware: "Yardi",
      paymentMethod: "card",
      monthlyCost: "40000.00" // 200 units * $200/unit
    });

    console.log("Created properties:", property1.id, property2.id);

    // Create sample property metrics
    const metrics = [
      // Occupancy metrics
      {
        propertyId: property1.id,
        metricType: "occupancy",
        value: "92.5",
        period: "monthly",
        date: new Date("2024-12-01")
      },
      {
        propertyId: property1.id,
        metricType: "occupancy", 
        value: "94.2",
        period: "monthly",
        date: new Date("2024-11-01")
      },
      // Revenue metrics
      {
        propertyId: property1.id,
        metricType: "revenue",
        value: "225000.00",
        period: "monthly",
        date: new Date("2024-12-01")
      },
      {
        propertyId: property2.id,
        metricType: "revenue",
        value: "340000.00", 
        period: "monthly",
        date: new Date("2024-12-01")
      },
      // NOI metrics
      {
        propertyId: property1.id,
        metricType: "noi",
        value: "135000.00",
        period: "monthly", 
        date: new Date("2024-12-01")
      }
    ];

    for (const metric of metrics) {
      await storage.createPropertyMetric(metric);
    }

    console.log("Created property metrics");

    // Create sample alerts
    const alerts = [
      {
        userId: userProfile.id,
        propertyId: property1.id,
        alertType: "threshold",
        severity: "high",
        title: "Occupancy Rate Below Target",
        message: "Riverside Commons occupancy dropped to 88.2%, below the 90% target threshold.",
        data: { currentValue: 88.2, targetValue: 90, metric: "occupancy" }
      },
      {
        userId: userProfile.id,
        propertyId: property2.id,
        alertType: "predictive",
        severity: "medium",
        title: "Maintenance Alert",
        message: "HVAC system in Building B may require maintenance based on efficiency patterns.",
        data: { buildingId: "B", systemType: "HVAC", riskScore: 0.73 }
      },
      {
        userId: userProfile.id,
        propertyId: property1.id,
        alertType: "anomaly",
        severity: "low", 
        title: "Utility Cost Variance",
        message: "Water usage increased 15% compared to seasonal average.",
        data: { utilityType: "water", variance: 15, period: "monthly" }
      }
    ];

    for (const alert of alerts) {
      await storage.createAlert(alert);
    }

    console.log("Created alerts");

    // Create AI insights
    const insights = [
      {
        userId: userProfile.id,
        propertyId: property1.id,
        insightType: "performance",
        category: "financial",
        title: "Revenue Optimization Opportunity",
        description: "Based on market analysis, Riverside Commons rents are 3-5% below comparable properties in the area.",
        recommendation: "Consider gradual rent increases of $50-75 per unit for new leases to capture market rate.",
        confidence: "89.5",
        impact: "medium",
        data: {
          currentAvgRent: 1500,
          marketAvgRent: 1575,
          potentialIncrease: 11250,
          confidence: 89.5
        }
      },
      {
        userId: userProfile.id,
        propertyId: property2.id,
        insightType: "market",
        category: "market",
        title: "Market Demand Increase",
        description: "Local market data shows 12% increase in rental demand for downtown properties.",
        recommendation: "Excellent time to optimize pricing strategy and reduce concessions.",
        confidence: "94.2",
        impact: "high",
        data: {
          demandIncrease: 12,
          vacancyRate: 4.2,
          marketTrend: "increasing"
        }
      },
      {
        userId: userProfile.id,
        propertyId: property1.id,
        insightType: "risk",
        category: "operational",
        title: "Preventive Maintenance Opportunity",
        description: "Analysis of maintenance patterns suggests proactive HVAC servicing could reduce emergency repairs by 25%.",
        recommendation: "Schedule quarterly HVAC maintenance across all units to optimize system performance.",
        confidence: "82.7",
        impact: "medium",
        data: {
          potentialSavings: 15000,
          riskReduction: 25,
          recommendedFrequency: "quarterly"
        }
      }
    ];

    for (const insight of insights) {
      await storage.createAiInsight(insight);
    }

    console.log("Created AI insights");

    // Create market data
    const marketDataEntries = [
      {
        area: "78701",
        dataType: "rent",
        value: "1575.00",
        period: new Date("2024-12-01"),
        source: "costar",
        metadata: { propertyType: "multifamily", unitSize: "1br" }
      },
      {
        area: "78701", 
        dataType: "vacancy",
        value: "4.2",
        period: new Date("2024-12-01"),
        source: "axiometrics",
        metadata: { propertyType: "multifamily" }
      },
      {
        area: "78702",
        dataType: "rent",
        value: "1725.00", 
        period: new Date("2024-12-01"),
        source: "costar",
        metadata: { propertyType: "multifamily", unitSize: "1br" }
      }
    ];

    for (const marketData of marketDataEntries) {
      await storage.createMarketData(marketData);
    }

    console.log("Created market data");

    // Create sample integrations
    const integrations = [
      {
        userId: userProfile.id,
        propertyId: property1.id,
        integrationType: "appfolio",
        status: "connected",
        config: {
          apiKey: "encrypted_key_123",
          endpoint: "https://api.appfolio.com/v1",
          syncFrequency: "daily"
        }
      },
      {
        userId: userProfile.id,
        propertyId: property2.id,
        integrationType: "yardi",
        status: "connected", 
        config: {
          username: "john.doe@elite",
          endpoint: "https://api.yardi.com/v2",
          syncFrequency: "hourly"
        }
      }
    ];

    for (const integration of integrations) {
      await storage.createIntegration(integration);
    }

    console.log("Created integrations");

    // Create sample reports
    const reports = [
      {
        userId: userProfile.id,
        reportType: "kpi",
        title: "Monthly KPI Dashboard - December 2024",
        description: "Comprehensive monthly performance report across all properties",
        parameters: {
          period: "monthly",
          month: "2024-12",
          properties: [property1.id, property2.id]
        },
        format: "pdf"
      },
      {
        userId: userProfile.id,
        reportType: "financial",
        title: "Q4 2024 Financial Performance",
        description: "Quarterly financial analysis with variance reporting",
        parameters: {
          period: "quarterly", 
          quarter: "Q4-2024",
          includeProjections: true
        },
        format: "excel"
      }
    ];

    for (const report of reports) {
      await storage.createReport(report);
    }

    console.log("Created reports");

    console.log("✅ Business intelligence sample data seeded successfully!");
    return userProfile.id;

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}