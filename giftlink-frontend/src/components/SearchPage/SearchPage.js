import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };
        fetchProducts();
    }, []);

    const handleSearch = async () => {
        let url = `${urlConfig.backendUrl}/api/search?name=${searchQuery}`;
        if (selectedCategory) url += `&category=${selectedCategory}`;
        if (selectedCondition) url += `&condition=${selectedCondition}`;
        if (ageRange) url += `&age_years=${ageRange}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.log('Search error: ' + error.message);
        }
    };

    const goToDetailsPage = (productId) => {
        navigate(`/app/details/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column mb-2">
                            <label>Category:</label>
                            <select className="form-control" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                                <option value="">All</option>
                                {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="d-flex flex-column mb-2">
                            <label>Condition:</label>
                            <select className="form-control" value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)}>
                                <option value="">All</option>
                                {conditions.map((cond, idx) => <option key={idx} value={cond}>{cond}</option>)}
                            </select>
                        </div>
                        <div className="d-flex flex-column mb-2">
                            <label>Max Age (Years): {ageRange}</label>
                            <input type="range" className="form-range" min="0" max="18" value={ageRange} onChange={e => setAgeRange(e.target.value)} />
                        </div>
                        <div className="d-flex flex-column mb-2">
                            <label>Search by Name:</label>
                            <input type="text" className="form-control" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                        <button className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
                    </div>

                    {searchResults.length > 0 ? (
                        searchResults.map(gift => (
                            <div key={gift._id} className="card mb-3" onClick={() => goToDetailsPage(gift._id)} style={{cursor: 'pointer'}}>
                                <div className="card-body">
                                    <h5 className="card-title">{gift.name}</h5>
                                    <p className="card-text">Category: {gift.category} | Condition: {gift.condition}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No gifts found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
