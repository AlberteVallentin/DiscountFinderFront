import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';
import StoreProductsModal from '../components/StoreProductsModal';

const VisionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
`;

const ShowModalButton = styled.button`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const dummyStore = {
  id: 1,
  name: 'Netto Aarhus City',
  brand: { displayName: 'Netto' },
  address: {
    addressLine: 'Skovvejen 55',
    postalCode: { postalCode: '8000', city: 'Aarhus C' },
  },
  products: [
    {
      ean: '5701234567890',
      productName: 'Økologisk Skyr med Vanilje',
      categories: [
        { nameDa: 'Mejeriprodukter', nameEn: 'Dairy' },
        { nameDa: 'Økologisk', nameEn: 'Organic' },
        { nameDa: 'Morgenmad', nameEn: 'Breakfast' },
      ],
      price: {
        originalPrice: 22.95,
        newPrice: 15.0,
        discount: 7.95,
        percentDiscount: 34.64,
      },
      timing: {
        startTime: '2024-12-14 00:00:00',
        endTime: '2024-12-16 23:59:59',
        lastUpdated: '2024-12-14 08:00:00',
      },
      stock: {
        quantity: 12,
        stockUnit: 'EACH',
        quantityAsInteger: 12,
      },
    },
    {
      ean: '5702345678901',
      productName: 'Hakket Kalv & Flæsk 500g',
      categories: [
        { nameDa: 'Kød', nameEn: 'Meat' },
        { nameDa: 'Hakket Kød', nameEn: 'Minced Meat' },
      ],
      price: {
        originalPrice: 42.95,
        newPrice: 25.0,
        discount: 17.95,
        percentDiscount: 41.79,
      },
      timing: {
        startTime: '2024-12-14 00:00:00',
        endTime: '2024-12-15 23:59:59',
        lastUpdated: '2024-12-14 09:30:00',
      },
      stock: {
        quantity: 8,
        stockUnit: 'EACH',
        quantityAsInteger: 8,
      },
    },
    {
      ean: '5703456789012',
      productName: 'Økologiske Bananer 1kg',
      categories: [
        { nameDa: 'Frugt & Grønt', nameEn: 'Produce' },
        { nameDa: 'Økologisk', nameEn: 'Organic' },
        { nameDa: 'Frugt', nameEn: 'Fruit' },
      ],
      price: {
        originalPrice: 24.95,
        newPrice: 18.0,
        discount: 6.95,
        percentDiscount: 27.86,
      },
      timing: {
        startTime: '2024-12-14 00:00:00',
        endTime: '2024-12-14 23:59:59',
        lastUpdated: '2024-12-14 07:15:00',
      },
      stock: {
        quantity: 25,
        stockUnit: 'EACH',
        quantityAsInteger: 25,
      },
    },
  ],
};

function Vision() {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(true);

  return (
    <VisionContainer>
      <h1>Vision</h1>
      <Card theme={theme} />
      <ShowModalButton theme={theme} onClick={() => setShowModal(true)}>
        Vis Tilbud
      </ShowModalButton>

      {showModal && (
        <StoreProductsModal
          store={dummyStore}
          onClose={() => setShowModal(false)}
          isLoggedIn={true}
          navigate={() => {}}
        />
      )}
    </VisionContainer>
  );
}

export default Vision;
