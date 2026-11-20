import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Check, Copy, ExternalLink, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { publicService } from '../services/publicService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { PublicStore, Category, Attribute, ReviewGenerationRequest, ReviewGenerationResponse, EventType, LanguageStyle } from '../types';
import { cn } from '../utils/helpers';

const LANGUAGE_STYLES: { value: LanguageStyle; label: string; description: string }[] = [
  { value: LanguageStyle.ENGLISH, label: 'English', description: 'Standard English review' },
  { value: LanguageStyle.TELUGU_ENGLISH_MIX, label: 'Telugu + English', description: 'Telugu-English mix in Latin script' },
  { value: LanguageStyle.HINGLISH, label: 'Hinglish', description: 'Hindi-English mix in Latin script' },
];

export const PublicReviewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [store, setStore] = useState<PublicStore | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReview, setLoadingReview] = useState(false);

  // Form state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);
  const [languageStyle, setLanguageStyle] = useState<LanguageStyle>(LanguageStyle.ENGLISH);
  const [reviewDraft, setReviewDraft] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Track page view
  useEffect(() => {
    const trackPageView = async () => {
      if (slug) {
        try {
          await publicService.trackEvent(slug, { eventType: EventType.PAGE_VIEW });
        } catch (err) {
          console.warn('Failed to track page view:', err);
        }
      }
    };
    trackPageView();
  }, [slug, store]);

  // Load store and categories/attributes
  useEffect(() => {
    if (slug) {
      loadStoreData();
    }
  }, [slug]);

  const loadStoreData = async () => {
    try {
      const response = await publicService.getPublicStore(slug!);
      setStore(response.store);
      setCategories(response.categories.filter(c => c.active));
      setAttributes(response.attributes.filter(a => a.active));
    } catch (err) {
      addToast('Store not found', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeToggle = (attributeId: string) => {
    setSelectedAttributeIds(prev =>
      prev.includes(attributeId)
        ? prev.filter(id => id !== attributeId)
        : [...prev, attributeId]
    );
  };

  const handleGenerateReview = async () => {
    if (!selectedCategoryId) {
      addToast('Please select an experience category', 'error');
      return;
    }
    if (selectedAttributeIds.length === 0) {
      addToast('Please select at least one attribute', 'error');
      return;
    }

    setLoadingReview(true);
    try {
      const request: ReviewGenerationRequest = {
        categoryId: selectedCategoryId,
        attributeIds: selectedAttributeIds,
        languageStyle,
      };

      const response: ReviewGenerationResponse = await publicService.generateReview(slug!, request);
      setReviewDraft(response.reviewText);
      addToast('Review generated!', 'success');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      addToast(error.response?.data?.message || 'Failed to generate review', 'error');
    } finally {
      setLoadingReview(false);
    }
  };

  const handleCopyReview = async () => {
    if (!reviewDraft) return;
    try {
      await navigator.clipboard.writeText(reviewDraft);
      setCopied(true);
      addToast('Review copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast('Failed to copy review', 'error');
    }
  };

  const handleGoogleReviewClick = async () => {
    if (!store) return;

    // Track the click event
    try {
      await publicService.trackEvent(slug!, { eventType: EventType.GOOGLE_LINK_CLICKED });
    } catch (err) {
      console.warn('Failed to track click:', err);
    }

    // Open Google review URL in new tab
    window.open(store.googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  const getCategoryAttributes = (categoryId: string) => {
    return attributes.filter(attr => attr.categoryId === categoryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Store not found</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header with Store Branding */}
      <header className="relative overflow-hidden" style={{ backgroundColor: store.primaryColor }}>
        <div className="absolute inset-0 bg-black/10" />
        {store.logoUrl && (
          <img
            src={store.logoUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10"
            aria-hidden="true"
          />
        )}
        <div className="relative px-4 py-8 sm:py-12 max-w-md mx-auto text-center text-white">
          {store.logoUrl && (
            <img
              src={store.logoUrl}
              alt={store.name}
              className="h-20 w-auto mx-auto mb-4 rounded-lg shadow-lg"
            />
          )}
          <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
          {store.description && (
            <p className="text-lg opacity-90 max-w-md mx-auto">{store.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8 sm:py-12">
        {/* Step 1: Select Category */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              Select Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No experience categories available</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-left min-h-[100px]',
                      selectedCategoryId === category.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {getCategoryAttributes(category.id).length} attributes
                    </p>
                    {selectedCategoryId === category.id && (
                      <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Select Attributes */}
        {selectedCategoryId && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                Select Attributes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const categoryAttributes = getCategoryAttributes(selectedCategoryId);
                return categoryAttributes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No attributes for this category</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categoryAttributes.map((attribute: Attribute) => (
                    <button
                      key={attribute.id}
                      onClick={() => handleAttributeToggle(attribute.id)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all',
                        selectedAttributeIds.includes(attribute.id)
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      )}
                    >
                      {attribute.label}
                      {selectedAttributeIds.includes(attribute.id) && (
                        <Check className="h-3.5 w-3.5 ml-1.5" />
                      )}
                    </button>
                  ))}
                </div>
              );
            })()}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Language Style */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
              Choose Language Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-left transition-all',
                  'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {LANGUAGE_STYLES.find(l => l.value === languageStyle)?.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {LANGUAGE_STYLES.find(l => l.value === languageStyle)?.description}
                    </p>
                  </div>
                  {showLanguageDropdown ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {showLanguageDropdown && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-10"
                >
                  {LANGUAGE_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => {
                        setLanguageStyle(style.value);
                        setShowLanguageDropdown(false);
                      }}
                      className={cn(
                        'w-full px-4 py-3 text-left transition-colors',
                        languageStyle === style.value
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{style.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{style.description}</p>
                        </div>
                        {languageStyle === style.value && (
                          <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Generate Review */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
              Generate Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerateReview}
              className="w-full gap-2 py-3 text-lg"
              size="lg"
              loading={loadingReview}
              disabled={!selectedCategoryId || selectedAttributeIds.length === 0}
            >
              <Star className="h-5 w-5" />
              Generate AI Review Draft
            </Button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              AI will create a personalized review based on your selections
            </p>
          </CardContent>
        </Card>

        {/* Review Output */}
        {reviewDraft && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Review Draft</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyReview}
                className="gap-1.5"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[120px] max-h-[300px] overflow-y-auto whitespace-pre-wrap text-gray-900 dark:text-white font-medium leading-relaxed">
                {reviewDraft}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Review generated in {languageStyle.replace('_', ' ')} • Copy and paste into Google Reviews
              </p>
            </CardContent>
          </Card>
        )}

        {/* Continue to Google Reviews */}
        <Button
          onClick={handleGoogleReviewClick}
          className="w-full gap-2 py-3 text-lg"
          size="lg"
        >
          <ExternalLink className="h-5 w-5" />
          Continue to Google Reviews
        </Button>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          You'll be redirected to Google to post your review. Your draft is copied to clipboard.
        </p>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Powered by Magic Review • No auto-posting • Your authentic review
          </p>
        </div>
      </main>
    </div>
  );
};