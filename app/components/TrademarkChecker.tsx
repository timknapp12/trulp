'use client';

import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa6';
import dynamic from 'next/dynamic';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function TrademarkChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  console.log('searchResults', searchResults);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile?.type.startsWith('image/')) {
      setFile(uploadedFile);
      checkTrademark(uploadedFile);
    }
  };

  const checkTrademark = async (imageFile: File) => {
    setLoading(true);
    try {
      const base64Image = await fileToBase64(imageFile);
      const response = await fetch('/api/uspto/trademark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error:', error);
      setSearchResults({ error: 'Analysis failed' });
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <div className='flex justify-end'>
        <WalletMultiButton />
      </div>
      <div className='max-w-2xl mx-auto rounded-xl w-full'>
        <div className='p-6 w-full'>
          <h2 className='text-2xl font-bold mb-6'>Logo & Trademark Analysis</h2>

          <div className='space-y-6 w-full'>
            <label className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-secondary rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <FaUpload className='w-12 h-12 mb-4 text-secondary' />
                <p className='mb-2 text-sm text-secondary'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-secondary'>
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                type='file'
                className='hidden w-full'
                accept='image/*'
                onChange={handleFileUpload}
              />
            </label>

            {loading && (
              <div className='text-center'>
                <p>Analyzing image...</p>
              </div>
            )}

            {searchResults && !searchResults.error && (
              <div className='space-y-6'>
                {/* Logo Detection Results */}
                <div className='border border-secondary p-4 rounded-lg'>
                  <h3 className='font-medium mb-3'>Logo Detection Results</h3>
                  {searchResults.logoDetection?.length > 0 ? (
                    <ul className='space-y-2'>
                      {searchResults.logoDetection.map(
                        (logo: any, index: number) => (
                          <li
                            key={index}
                            className='flex justify-between items-center p-2 rounded'
                          >
                            <span>{logo.name}</span>
                            <span className='text-sm text-secondary'>
                              {Math.round(logo.confidence * 100)}% confidence
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No logos detected</p>
                  )}
                </div>

                {/* Design Codes */}
                {searchResults.designCodes?.length > 0 && (
                  <div className='border border-secondary p-4 rounded-lg'>
                    <h3 className='font-medium mb-3'>
                      Detected Design Elements
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {searchResults.designCodes.map(
                        (code: string, index: number) => (
                          <span
                            key={index}
                            className='px-2 py-1 border border-secondary text-secondary rounded-lg text-sm'
                          >
                            {code}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* USPTO Results */}
                {searchResults.trademarkResults?.length > 0 && (
                  <div className='border border-secondary p-4 rounded-lg'>
                    <h3 className='font-medium mb-3'>
                      Trademark Database Results
                    </h3>
                    <div className='space-y-4'>
                      {searchResults.trademarkResults.map(
                        (result: any, index: number) => (
                          <div
                            key={index}
                            className='p-3 rounded border border-secondary'
                          >
                            <p className='font-medium'>
                              Design Code: {result.code}
                            </p>
                            <div className='mt-2 text-sm text-secondary'>
                              <pre className='whitespace-pre-wrap'>
                                {result.result}
                              </pre>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <div className='mt-4 pt-4 border-t border-secondary'>
                      <p className='text-sm text-secondary'>
                        Matches found in USPTO database. Additional resources:
                      </p>
                      <div className='mt-2 space-x-4'>
                        <a
                          href='https://www.uspto.gov/trademarks'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-blue-600 hover:underline'
                        >
                          USPTO Database
                        </a>
                        <a
                          href='https://www.copyright.gov/registration/'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-blue-600 hover:underline'
                        >
                          Copyright Registration
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                {searchResults.features &&
                  searchResults.features.length > 0 && (
                    <div className='border border-secondary p-4 rounded-lg'>
                      <h3 className='font-medium mb-3'>Detected Features</h3>
                      <div className='flex flex-wrap gap-2'>
                        {searchResults.features.map(
                          (feature: string, index: number) => (
                            <span
                              key={index}
                              className='px-3 py-1.5 border border-secondary text-secondary rounded-lg text-sm'
                            >
                              {feature}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {searchResults?.error && (
              <div className='border border-red p-4 rounded-lg'>
                <p className='text-red'>{searchResults.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
