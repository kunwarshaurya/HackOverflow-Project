import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Heart, 
  Download, 
  Share2, 
  Eye,
  Calendar,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';

const StudentGalleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterCategory, setFilterCategory] = useState('all');
  const [likedImages, setLikedImages] = useState(new Set());

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockGalleries = [
      {
        id: 1,
        title: "Tech Fest 2024",
        description: "Annual technology festival showcasing innovation",
        date: "2024-03-15",
        category: "technical",
        clubName: "Tech Club",
        coverImage: "https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
        ],
        likes: 234,
        views: 1520
      },
      {
        id: 2,
        title: "Cultural Night",
        description: "Celebrating diversity through music and dance",
        date: "2024-02-28",
        category: "cultural",
        clubName: "Cultural Society",
        coverImage: "https://images.unsplash.com/photo-1459749411177-042180ceea72?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1459749411177-042180ceea72?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80"
        ],
        likes: 189,
        views: 892
      },
      {
        id: 3,
        title: "Sports Championship",
        description: "Inter-college sports competition highlights",
        date: "2024-01-20",
        category: "sports",
        clubName: "Sports Committee",
        coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80"
        ],
        likes: 156,
        views: 743
      }
    ];
    setGalleries(mockGalleries);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technical', name: 'Technical' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'sports', name: 'Sports' },
    { id: 'academic', name: 'Academic' }
  ];

  const filteredGalleries = filterCategory === 'all' 
    ? galleries 
    : galleries.filter(gallery => gallery.category === filterCategory);

  const toggleLike = (imageId) => {
    const newLikedImages = new Set(likedImages);
    if (newLikedImages.has(imageId)) {
      newLikedImages.delete(imageId);
    } else {
      newLikedImages.add(imageId);
    }
    setLikedImages(newLikedImages);
  };

  const openGallery = (gallery) => {
    setSelectedGallery(gallery);
    setSelectedImage(0);
  };

  const closeGallery = () => {
    setSelectedGallery(null);
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedGallery && selectedImage < selectedGallery.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const GalleryCard = ({ gallery }) => (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#ffeadb] cursor-pointer"
         onClick={() => openGallery(gallery)}>
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={gallery.coverImage} 
          alt={gallery.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Image Count Badge */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <ImageIcon size={14} />
          {gallery.images.length}
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-[#8b597b] text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
          {gallery.category}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-black text-xl mb-1">{gallery.title}</h3>
          <p className="text-white/80 text-sm font-medium">{gallery.clubName}</p>
        </div>
      </div>

      {/* Gallery Info */}
      <div className="p-6">
        <p className="text-[#493129]/60 text-sm font-medium mb-4 line-clamp-2">
          {gallery.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-[#493129]/60">
            <div className="flex items-center gap-1">
              <Heart size={16} className="text-[#efa3a0]" />
              <span className="font-bold">{gallery.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} className="text-[#8b597b]" />
              <span className="font-bold">{gallery.views}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#493129]/60">
            <Calendar size={16} />
            <span className="font-bold">{new Date(gallery.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const GalleryListItem = ({ gallery }) => (
    <div className="bg-white rounded-[2rem] p-6 border border-[#ffeadb] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex gap-6"
         onClick={() => openGallery(gallery)}>
      <div className="w-32 h-24 rounded-2xl overflow-hidden flex-shrink-0">
        <img 
          src={gallery.coverImage} 
          alt={gallery.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-black text-[#493129] mb-1">{gallery.title}</h3>
            <p className="text-[#8b597b] font-bold text-sm">{gallery.clubName}</p>
          </div>
          <span className="bg-[#efa3a0]/20 text-[#8b597b] px-3 py-1 rounded-full text-xs font-bold uppercase">
            {gallery.category}
          </span>
        </div>
        <p className="text-[#493129]/60 text-sm font-medium mb-3 line-clamp-2">
          {gallery.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-[#493129]/60">
            <div className="flex items-center gap-1">
              <ImageIcon size={16} />
              <span className="font-bold">{gallery.images.length} photos</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={16} className="text-[#efa3a0]" />
              <span className="font-bold">{gallery.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} className="text-[#8b597b]" />
              <span className="font-bold">{gallery.views}</span>
            </div>
          </div>
          <span className="text-[#493129]/60 font-bold text-sm">
            {new Date(gallery.date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ffeadb] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#efa3a0] animate-pulse"></div>
            <span className="text-xs font-black text-[#8b597b] uppercase tracking-[0.4em]">Photo Galleries</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#493129] tracking-tighter mb-4">
            Campus <span className="text-[#8b597b]">Memories</span>
          </h1>
          <p className="text-[#493129]/60 font-bold text-lg">Explore moments from campus events and activities</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-8 border border-[#ffeadb] shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                    filterCategory === category.id
                      ? 'bg-[#8b597b] text-white'
                      : 'bg-[#ffeadb] text-[#493129] hover:bg-[#ffdec7]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#ffeadb] rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-[#8b597b] shadow-sm' 
                    : 'text-[#493129]/60 hover:text-[#493129]'
                }`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-[#8b597b] shadow-sm' 
                    : 'text-[#493129]/60 hover:text-[#493129]'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Galleries */}
        {filteredGalleries.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }>
            {filteredGalleries.map((gallery) => (
              viewMode === 'grid' 
                ? <GalleryCard key={gallery.id} gallery={gallery} />
                : <GalleryListItem key={gallery.id} gallery={gallery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ImageIcon size={64} className="mx-auto text-[#493129]/30 mb-6" />
            <h3 className="text-2xl font-black text-[#493129] mb-4">No Galleries Found</h3>
            <p className="text-[#493129]/60 font-bold">No galleries match your current filter</p>
          </div>
        )}

        {/* Gallery Modal */}
        {selectedGallery && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl max-h-full">
              {/* Close Button */}
              <button
                onClick={closeGallery}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={24} />
              </button>

              {/* Navigation Buttons */}
              {selectedImage > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              {selectedImage < selectedGallery.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Main Image */}
              <div className="relative">
                <img
                  src={selectedGallery.images[selectedImage]}
                  alt={`${selectedGallery.title} - Image ${selectedImage + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                />
                
                {/* Image Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-lg">{selectedGallery.title}</h3>
                      <p className="text-white/80 text-sm">{selectedGallery.clubName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(`${selectedGallery.id}-${selectedImage}`)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Heart 
                          size={20} 
                          fill={likedImages.has(`${selectedGallery.id}-${selectedImage}`) ? 'currentColor' : 'none'}
                          className={likedImages.has(`${selectedGallery.id}-${selectedImage}`) ? 'text-red-500' : 'text-white'}
                        />
                      </button>
                      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <Share2 size={20} />
                      </button>
                      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
                {selectedGallery.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImage 
                        ? 'border-white' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGalleries;