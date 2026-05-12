import { RequestHandler } from "express";

interface TrackingHistory {
  id: number;
  trackingNumber: string;
  location: string;
  status: string;
  updatedAt: Date;
}

interface Package {
  id: number;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  packageType: string;
  weight: number;
  price: number;
  status: "Pending" | "Picked Up" | "In Transit" | "Out for Delivery" | "Delivered";
  currentLocation: string;
  eta: Date;
  createdAt: Date;
  history: TrackingHistory[];
}

let packages: Package[] = [
  {
    id: 1,
    trackingNumber: "NEX1234567890",
    senderName: "John Doe",
    receiverName: "Jane Smith",
    receiverAddress: "123 Main St, Lagos, Nigeria",
    receiverPhone: "08012345678",
    packageType: "Electronics",
    weight: 2.5,
    price: 5500,
    status: "In Transit",
    currentLocation: "Lagos, Nigeria",
    eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    history: [
      {
        id: 1,
        trackingNumber: "NEX1234567890",
        location: "Port Harcourt, Nigeria",
        status: "Pending",
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        trackingNumber: "NEX1234567890",
        location: "Port Harcourt, Nigeria",
        status: "Picked Up",
        updatedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        trackingNumber: "NEX1234567890",
        location: "Enugu, Nigeria",
        status: "In Transit",
        updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

let packageIdCounter = 2;
let historyIdCounter = 4;

const generateTrackingNumber = (): string => {
  return "NEX" + Math.random().toString().slice(2, 12);
};

export const handleCreatePackage: RequestHandler = (req, res) => {
  const {
    senderName,
    receiverName,
    receiverAddress,
    receiverPhone,
    packageType,
    weight,
    price,
  } = req.body;

  if (
    !senderName ||
    !receiverName ||
    !receiverAddress ||
    !receiverPhone ||
    !packageType ||
    !weight ||
    !price
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newPackage: Package = {
    id: packageIdCounter++,
    trackingNumber: generateTrackingNumber(),
    senderName,
    receiverName,
    receiverAddress,
    receiverPhone,
    packageType,
    weight: parseFloat(weight),
    price: parseFloat(price),
    status: "Pending",
    currentLocation: "Warehouse",
    eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    history: [
      {
        id: historyIdCounter++,
        trackingNumber: "",
        location: "Warehouse",
        status: "Pending",
        updatedAt: new Date(),
      },
    ],
  };

  newPackage.history[0].trackingNumber = newPackage.trackingNumber;

  packages.push(newPackage);

  res.status(201).json({
    message: "Package created successfully",
    package: newPackage,
  });
};

export const handleTrackPackage: RequestHandler = (req, res) => {
  const { trackingNumber } = req.params;

  const pkg = packages.find(
    (p) => p.trackingNumber.toUpperCase() === trackingNumber.toUpperCase()
  );

  if (!pkg) {
    return res.status(404).json({ error: "Tracking number not found" });
  }

  res.json({
    trackingNumber: pkg.trackingNumber,
    sender: pkg.senderName,
    receiver: pkg.receiverName,
    status: pkg.status,
    eta: pkg.eta,
    currentLocation: pkg.currentLocation,
    weight: `${pkg.weight} kg`,
    price: `$${pkg.price}`,
    history: pkg.history,
  });
};

export const handleUpdatePackageStatus: RequestHandler = (req, res) => {
  const { trackingNumber } = req.params;
  const { status, location } = req.body;

  const pkg = packages.find(
    (p) => p.trackingNumber.toUpperCase() === trackingNumber.toUpperCase()
  );

  if (!pkg) {
    return res.status(404).json({ error: "Package not found" });
  }

  pkg.status = status;
  pkg.currentLocation = location;

  // Add to history
  pkg.history.push({
    id: historyIdCounter++,
    trackingNumber: pkg.trackingNumber,
    location,
    status,
    updatedAt: new Date(),
  });

  res.json({
    message: "Package status updated",
    package: pkg,
  });
};

export const handleGetAllPackages: RequestHandler = (req, res) => {
  res.json({
    packages: packages.map((p) => ({
      id: p.id,
      trackingNumber: p.trackingNumber,
      sender: p.senderName,
      receiver: p.receiverName,
      status: p.status,
    })),
  });
};

export const handleDeletePackage: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = packages.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Package not found" });
  }

  packages.splice(index, 1);

  res.json({ message: "Package deleted successfully" });
};
