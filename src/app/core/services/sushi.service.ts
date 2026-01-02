import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout, map } from 'rxjs/operators';
import { SushiBox } from '../../shared/models/sushi-box.model';

@Injectable({
    providedIn: 'root'
})
export class SushiService {
    // Use 127.0.0.1 to avoid DNS resolution delays
    private apiUrl = 'http://127.0.0.1/sae301/api/boxes/index.php';

    // Fallback data if API fails
    private mockBoxes: SushiBox[] = [
        {
            id: 1,
            name: "Tasty Blend",
            pieces: 12,
            price: 12.50,
            image: "assets/images/tastyblend.jpg",
            description: "Un assortiment gourmand.",
            flavors: ["saumon", "avocat", "cheese"],
            foods: [
                { nom: "California Saumon Avocat", quantite: 3 },
                { nom: "Sushi Saumon", quantite: 3 },
                { nom: "Spring Avocat Cheese", quantite: 3 },
                { nom: "California pacific", quantite: 3 },
                { nom: "Edamame/Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 2,
            name: "Amateur Mix",
            pieces: 18,
            price: 15.90,
            image: "assets/images/tastyblend.jpg",
            description: "Mix pour les amateurs de saveurs variées.",
            flavors: ["coriandre", "saumon", "avocat", "cheese"],
            foods: [
                { nom: "Maki Salmon Roll", quantite: 3 },
                { nom: "Spring Saumon Avocat", quantite: 3 },
                { nom: "Maki Cheese Avocat", quantite: 6 },
                { nom: "California Saumon Avocat", quantite: 3 },
                { nom: "Edamame/Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 3,
            name: "Saumon Original",
            pieces: 11,
            price: 12.50,
            image: "assets/images/amour_saumon.png",
            description: "L'original, 100% saumon.",
            flavors: ["saumon", "avocat"],
            foods: [
                { nom: "California Saumon Avocat", quantite: 6 },
                { nom: "Sushi Saumon", quantite: 5 },
                { nom: "Edamame/Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 4,
            name: "Salmon Lovers",
            pieces: 18,
            price: 15.90,
            image: "assets/images/amour_saumon.png",
            description: "Pour les amoureux du saumon.",
            flavors: ["coriandre", "saumon", "avocat"],
            foods: [
                { nom: "California Saumon Avocat", quantite: 6 },
                { nom: "Spring Saumon Avocat", quantite: 6 },
                { nom: "Sushi Saumon", quantite: 6 },
                { nom: "Edamame/Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 5,
            name: "Salmon Classic",
            pieces: 10,
            price: 15.90,
            image: "assets/images/amour_saumon.png",
            description: "Le classique indémodable.",
            flavors: ["saumon"],
            foods: [
                { nom: "Sushi Saumon", quantite: 10 },
                { nom: "Edamame/Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 6,
            name: "Master Mix",
            pieces: 12,
            price: 15.90,
            image: "assets/images/tastyblend.jpg",
            description: "Un mélange de maître à déguster.",
            flavors: ["saumon", "thon", "avocat"],
            foods: [
                { nom: "Sushi Saumon", quantite: 4 },
                { nom: "Sushi Thon", quantite: 2 },
                { nom: "California Thon Avocat", quantite: 3 },
                { nom: "California Saumon Avocat", quantite: 3 },
                { nom: "Edamame / Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 7,
            name: "Sunrise",
            pieces: 18,
            price: 15.90,
            image: "assets/images/tastyblend.jpg",
            description: "Pour un réveil des papilles.",
            flavors: ["saumon", "thon", "avocat", "cheese"],
            foods: [
                { nom: "Maki Salmon Roll", quantite: 6 },
                { nom: "California Saumon Avocat", quantite: 6 },
                { nom: "California Thon Cuit Avocat", quantite: 6 },
                { nom: "Edamame / Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 8,
            name: "Sando Box Chicken Katsu",
            pieces: 13,
            price: 15.90,
            image: "assets/images/tastyblend.jpg",
            description: "Avec Sando Chicken Katsu croustillant.",
            flavors: ["saumon", "viande", "avocat", "cheese"],
            foods: [
                { nom: "Sando Chicken Katsu", quantite: 0.5 },
                { nom: "Maki Salmon Roll", quantite: 6 },
                { nom: "California Saumon Avocat", quantite: 6 },
                { nom: "California Thon Cuit Avocat", quantite: 6 },
                { nom: "Edamame / Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 9,
            name: "Sando Box Salmon Aburi",
            pieces: 13,
            price: 15.90,
            image: "assets/images/amour_saumon.png",
            description: "La délicatesse du saumon mi-cuit.",
            flavors: ["saumon", "thon", "avocat"],
            foods: [
                { nom: "Sando Salmon Aburi", quantite: 0.5 },
                { nom: "California Saumon Avocat", quantite: 6 },
                { nom: "California Thon Cuit Avocat", quantite: 6 },
                { nom: "Edamame / Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 10,
            name: "Super Salmon",
            pieces: 24,
            price: 19.90,
            image: "assets/images/amour_saumon.png",
            description: "Le super héros des plateaux saumon.",
            flavors: ["coriandre", "saumon", "avocat", "cheese"],
            foods: [
                { nom: "California Saumon Avocat", quantite: 6 },
                { nom: "Maki Salmon Roll", quantite: 6 },
                { nom: "Maki Salmon", quantite: 6 },
                { nom: "Spring Saumon Avocat", quantite: 6 },
                { nom: "Edamame / Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 11,
            name: "California Dream",
            pieces: 24,
            price: 19.90,
            image: "assets/images/tastyblend.jpg",
            description: "Le rêve californien à partager.",
            flavors: ["spicy", "saumon", "thon", "crevette", "viande", "avocat"],
            foods: [
                { nom: "California Saumon Avocat", quantite: 6 },
                { nom: "California Crevette", quantite: 6 },
                { nom: "California Thon Cuit Avocat", quantite: 6 },
                { nom: "California Chicken Katsu", quantite: 6 },
                { nom: "Edamame / Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 12,
            name: "Gourmet Mix",
            pieces: 22,
            price: 24.50,
            image: "assets/images/tastyblend.jpg",
            description: "Sélection gourmet raffinée.",
            flavors: ["coriande", "spicy", "saumon", "viande", "avocat", "seriole lalandi"],
            foods: [
                { nom: "Spring tataki Saumon", quantite: 6 },
                { nom: "Signature Dragon Roll", quantite: 4 },
                { nom: "California French Touch", quantite: 3 },
                { nom: "California French salmon", quantite: 6 },
                { nom: "California Yellowtail Ponzu", quantite: 3 },
                { nom: "Edamame / Salade de chou", quantite: 1 }
            ]
        },
        {
            id: 13,
            name: "Fresh Mix",
            pieces: 22,
            price: 24.50,
            image: "assets/images/veggie_box.png",
            description: "L'assortiment le plus frais.",
            flavors: ["spicy", "saumon", "thon", "avocat", "cheese"],
            foods: [
                { nom: "Signature Rock'n Roll", quantite: 4 },
                { nom: "Maki Salmon Roll", quantite: 6 },
                { nom: "California Pacific", quantite: 6 },
                { nom: "Sushi Salmon", quantite: 4 },
                { nom: "Sushi Saumon Tsukudani", quantite: 2 },
                { nom: "Edamame / Salade de chou", quantite: 1 }
            ]
        }
    ];

    constructor(private http: HttpClient) { }

    getBoxes(): Observable<SushiBox[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            timeout(1000),
            map(apiBoxes => apiBoxes.map(b => ({
                id: b.id,
                name: b.nom,
                pieces: b.pieces,
                price: b.prix,
                image: this.resolveImage(b.image),
                description: b.description || 'Une délicieuse box de sushis fraichement préparés.',
                flavors: b.saveurs || [],
                foods: b.aliments ? b.aliments.map((a: any) => ({ nom: a.nom, quantite: a.quantite })) : []
            }))),
            catchError(error => {
                // console.warn('API connection failed or timed out, using mock data:', error);
                return of(this.mockBoxes);
            })
        );
    }

    private resolveImage(apiImage: string): string {
        // Map API image slugs to local assets
        if (!apiImage) return 'assets/images/logo_blanc.png';

        if (apiImage.includes('tasty-blend') || apiImage.includes('amateur-mix') || apiImage.includes('master-mix') || apiImage.includes('sunrise') || apiImage.includes('chicken') || apiImage.includes('california-dream') || apiImage.includes('gourmet')) {
            return 'assets/images/tastyblend.jpg';
        }
        if (apiImage.includes('saumon') || apiImage.includes('salmon')) {
            return 'assets/images/amour_saumon.png';
        }
        if (apiImage.includes('veggie') || apiImage.includes('fresh')) {
            return 'assets/images/veggie_box.png';
        }

        return 'assets/images/logo_blanc.png';
    }

    getBoxById(id: number): Observable<SushiBox | undefined> {
        // For single box, we can also try API or fallback
        return of(this.mockBoxes.find(b => b.id === id));
    }
}
