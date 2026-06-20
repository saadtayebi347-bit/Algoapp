/**
 * banque_question.js — Banque de questions de l'examen CodeExam Pro
 * --------------------------------------------------------------------
 * Ce fichier centralise TOUTES les questions disponibles pour les examens
 * (énoncés, code initial, langage, type d'exercice, etc.).
 *
 * À chaque démarrage d'examen, App.jsx sélectionne aléatoirement un
 * sous-ensemble de questions parmi ce tableau (voir QUESTIONS_PER_EXAM
 * et selectRandomQuestions dans App.jsx).
 *
 * Pour ajouter une question : ajouter un nouvel objet au tableau ci-dessous
 * avec un "id" UNIQUE (jamais réutilisé), un "titre", un "langage"
 * (python | java | c | cpp | javascript), un "type"
 * (ecriture | completion | correction), un "enonce" et un "codeInitial".
 * Aucune autre modification n'est nécessaire : la nouvelle question entre
 * automatiquement dans le pool de tirage aléatoire.
 */

export const banqueQuestions = [
  // ─────────────────────────────────────────────
  // DICHOTOMIE (questions 101–116)
  // ─────────────────────────────────────────────
  {
    id: 1, titre: "Dichotomie – Implémentation complète", langage: "python",
    type: "ecriture",
    enonce: "Implémentez la méthode de dichotomie dichotomie(f, a, b, eps) qui retourne l'approximation x* d'un zéro de f sur [a,b], avec f(a)·f(b) < 0 et une précision eps. Retournez (x_star, nb_iterations).",
    codeInitial: `def dichotomie(f, a, b, eps):
    """
    f   : fonction continue
    a,b : tels que f(a)*f(b) < 0
    eps : précision souhaitée
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 2, titre: "Dichotomie – Condition d'arrêt", langage: "python",
    type: "completion",
    enonce: "Complétez la boucle de la méthode de dichotomie. La condition d'arrêt porte sur la longueur de l'intervalle [a,b].",
    codeInitial: `def dichotomie(f, a, b, eps):
    while ___:          # compléter la condition d'arrêt
        m = (a + b) / 2
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
    return (a + b) / 2
`,
  },
  {
    id: 3, titre: "Dichotomie – Correction d'erreurs", langage: "python",
    type: "correction",
    enonce: "Le code suivant contient plusieurs erreurs logiques. Identifiez-les et corrigez-les pour que la méthode de dichotomie soit correcte.",
    codeInitial: `def dichotomie(f, a, b, eps):
    while (b - a) > eps:          # erreur sur le critère ?
        m = (a + b)               # erreur ici
        if f(a) * f(m) <= 0:
            a = m                 # erreur ici
        else:
            b = m
    return a                      # erreur ici
`,
  },
  {
    id: 4, titre: "Dichotomie – Trace d'exécution", langage: "python",
    type: "ecriture",
    enonce: "Implémentez dichotomie_trace(f, a, b, eps) qui retourne la liste de tous les milieux m calculés à chaque itération, ainsi que la valeur finale x*.",
    codeInitial: `def dichotomie_trace(f, a, b, eps):
    """
    Retourne (liste_milieux, x_star)
    """
    pass
`,
  },
  {
    id: 5, titre: "Dichotomie – Nombre d'itérations théorique", langage: "python",
    type: "ecriture",
    enonce: "Implémentez nb_iterations_dichotomie(a, b, eps) qui calcule le nombre d'itérations nécessaires à la méthode de dichotomie pour atteindre la précision eps sur [a,b]",
    codeInitial: `import math

def nb_iterations_dichotomie(a, b, eps):
    """
    Retourne le nombre d'itérations suffisantes
    sans exécuter la boucle.
    """
    pass
`,
  },
  {
    id: 6, titre: "Dichotomie – Vérification du signe", langage: "python",
    type: "completion",
    enonce: "Complétez la fonction verifier_dichotomie(f, a, b) qui vérifie que la condition f(a)·f(b) < 0 est satisfaite avant d'appliquer la méthode, et lève une ValueError sinon.",
    codeInitial: `def verifier_dichotomie(f, a, b):
    if ___:          # compléter la condition
        raise ValueError("f(a) et f(b) doivent être de signes opposés.")
    return True
`,
  },
  {
    id: 7, titre: "Dichotomie – Cas particulier f(m)=0", langage: "python",
    type: "completion",
    enonce: "Complétez la méthode de dichotomie pour qu'elle s'arrête immédiatement si f(m) = 0 exactement (zéro trouvé avec précision machine).",
    codeInitial: `def dichotomie(f, a, b, eps):
    while (b - a) / 2 > eps:
        m = (a + b) / 2
        if ___:          # cas particulier : zéro exact
            return m
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
    return (a + b) / 2
`,
  },
  {
    id: 8, titre: "Dichotomie – Borne inférieure d'itérations", langage: "python",
    type: "completion",
    enonce: "Complétez la fonction qui calcule la borne inférieure du nombre d'itérations nécessaires pour garantir une précision eps sur [a, b].",
    codeInitial: `import math

def borne_iterations(a, b, eps):
    # La longueur de l'intervalle est divisée par 2 à chaque itération.
    # On cherche n tel que (b-a) / 2^n <= eps
    return math.ceil(___)   # compléter
`,
  },
  {
    id: 9, titre: "Dichotomie – Robustesse aux entrées invalides", langage: "python",
    type: "correction",
    enonce: "Corrigez ce code pour qu'il gère correctement les cas a >= b, eps <= 0, et f(a)*f(b) >= 0.",
    codeInitial: `def dichotomie(f, a, b, eps):
    # Aucune vérification des entrées
    while (b - a) / 2 > eps:
        m = (a + b) / 2
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
    return (a + b) / 2
`,
  },
  {
    id: 10, titre: "Dichotomie – Intervalle final", langage: "python",
    type: "ecriture",
    enonce: "Implémentez dichotomie_intervalle(f, a, b, eps) qui retourne non seulement x* mais aussi l'intervalle final [a_final, b_final] et la valeur f(x*).",
    codeInitial: `def dichotomie_intervalle(f, a, b, eps):
    """
    Retourne (x_star, a_final, b_final, f_x_star)
    """
    pass
`,
  },
  {
    id: 11,
    titre: "Dichotomie – Recherche d'un zéro",
    langage: "python",
    type: "ecriture",
    enonce: "Implémentez la fonction dichotomie(f, a, b, eps) qui recherche un zéro de la fonction f sur l'intervalle [a, b]",
    codeInitial: `def dichotomie(f, a, b, eps):
    """
    Recherche un zéro de f sur [a, b]
    par la méthode de dichotomie.

    Retourne :
        x_star : approximation de la racine
    """
    pass
`,
},

  // ─────────────────────────────────────────────
  // SECTION DORÉE (questions 117–132)
  // ─────────────────────────────────────────────
  {
    id: 12, titre: "Section dorée – Implémentation complète", langage: "python",
    type: "ecriture",
    enonce: "Implémentez la méthode de la section dorée section_doree(f, a, b, eps) pour minimiser une fonction unimodale sur [a,b]. Retournez (x_star, nb_iterations).",
    codeInitial: `def section_doree(f, a, b, eps):
    """
    f   : fonction unimodale sur [a,b]
    eps : précision souhaitée
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 13, titre: "Section dorée – Initialisation des points internes", langage: "python",
    type: "completion",
    enonce: "Complétez l'initialisation des deux points internes c et d dans la méthode de la section dorée.",
    codeInitial: `import math

def section_doree(f, a, b, eps):
    phi = (math.sqrt(5) - 1) / 2
    c = ___          # compléter
    d = ___          # compléter
    fc = f(c)
    fd = f(d)
    while (b - a) > eps:
        if fc < fd:
            b = d; d = c; fd = fc
            c = b - phi * (b - a); fc = f(c)
        else:
            a = c; c = d; fc = fd
            d = a + phi * (b - a); fd = f(d)
    return (a + b) / 2
`,
  },
  {
    id: 14, titre: "Section dorée – Correction d'erreurs", langage: "python",
    type: "correction",
    enonce: "Corrigez les erreurs dans cette implémentation de la section dorée.",
    codeInitial: `import math

def section_doree(f, a, b, eps):
    phi = (math.sqrt(5) + 1) / 2       # erreur : mauvais signe
    c = b - phi * (b - a)
    d = a + phi * (b - a)
    fc, fd = f(c), f(d)
    while (b - a) > eps:
        if fc < fd:
            b = d; d = c; fd = fc
            c = b - phi * (b - a)
            fc = f(d)                   # erreur ici
        else:
            a = c; c = d; fc = fd
            d = a + phi * (b - a)
            fd = f(d)
    return a + b                        # erreur ici
`,
  },
  {
    id: 15, titre: "Section dorée – Valeur du nombre d'or", langage: "python",
    type: "completion",
    enonce: "Complétez la fonction qui retourne le rapport de réduction de l'intervalle à chaque itération de la section dorée, ainsi que le nombre d'or φ utilisé.",
    codeInitial: `import math

def infos_section_doree():
    phi = ___                    # compléter : (√5-1)/2
    reduction = ___              # compléter : facteur de réduction = phi
    return {'phi': phi, 'reduction_par_iteration': reduction}
`,
  },
  {
    id: 16, titre: "Section dorée – Trace de convergence", langage: "python",
    type: "ecriture",
    enonce: "Implémentez section_doree_trace(f, a, b, eps) qui retourne la liste de tous les intervalles [a_k, b_k] à chaque itération, ainsi que x*.",
    codeInitial: `def section_doree_trace(f, a, b, eps):
    """
    Retourne (historique_intervalles, x_star)
    historique_intervalles : liste de tuples (a_k, b_k)
    """
    pass
`,
  },
  {
    id: 17, titre: "Section dorée – Mise à jour des points internes", langage: "python",
    type: "completion",
    enonce: "Complétez le bloc `else` de la section dorée, qui déplace la borne gauche et recalcule d.",
    codeInitial: `import math

def section_doree(f, a, b, eps):
    phi = (math.sqrt(5) - 1) / 2
    c = b - phi * (b - a); fc = f(c)
    d = a + phi * (b - a); fd = f(d)
    while (b - a) > eps:
        if fc < fd:
            b = d; d = c; fd = fc
            c = b - phi * (b - a); fc = f(c)
        else:
            a = ___       # compléter
            c = ___       # compléter
            fc = ___      # compléter
            d = ___       # compléter
            fd = f(d)
    return (a + b) / 2
`,
  },
  {
    id: 18, titre: "Section dorée – Nombre d'itérations théorique", langage: "python",
    type: "ecriture",
    enonce: "Implémentez `nb_iterations_section_doree(a, b, eps)` qui calcule le nombre d'itérations nécessaires à la section dorée pour atteindre la précision eps sur [a,b].",
    codeInitial: `import math

def nb_iterations_section_doree(a, b, eps):
    """
    Retourne le nombre d'itérations théoriques.
    """
    pass
`,
  },
  {
    id: 19, titre: "Section dorée – Réutilisation des évaluations", langage: "python",
    type: "completion",
    enonce: "La section dorée ne calcule qu'UNE nouvelle évaluation de f par itération. Complétez le code pour montrer cette réutilisation explicitement.",
    codeInitial: `import math

def section_doree(f, a, b, eps):
    phi = (math.sqrt(5) - 1) / 2
    c = b - phi * (b - a); fc = f(c)
    d = a + phi * (b - a); fd = f(d)
    nb_eval = 2                     # déjà 2 évaluations
    while (b - a) > eps:
        if fc < fd:
            b = d; d = c; fd = fc
            c = b - phi * (b - a)
            fc = f(c)
            nb_eval += ___          # compléter
        else:
            a = c; c = d; fc = fd
            d = a + phi * (b - a)
            fd = f(d)
            nb_eval += ___          # compléter
    return (a + b) / 2, nb_eval
`,
  },
  {
    id: 20, titre: "Section dorée – Robustesse", langage: "python",
    type: "correction",
    enonce: "Ce code de section dorée présente une erreur dans la mise à jour du point c après déplacement de la borne gauche. Corrigez-la.",
    codeInitial: `import math

def section_doree(f, a, b, eps):
    phi = (math.sqrt(5) - 1) / 2
    c = b - phi * (b - a); fc = f(c)
    d = a + phi * (b - a); fd = f(d)
    while (b - a) > eps:
        if fc < fd:
            b = d; d = c; fd = fc
            c = b - phi * (b - a); fc = f(c)
        else:
            a = c; c = d; fc = fd
            d = a + phi * (b - a)
            fc = f(c)               # erreur : on recalcule fc au lieu de fd
            fd = f(d)
    return (a + b) / 2
`,
  },
  {
    id: 21, titre: "Section dorée – Critère relatif", langage: "python",
    type: "completion",
    enonce: "Modifiez le critère d'arrêt de la section dorée pour utiliser un critère relatif (b-a)/(|a|+|b|) < eps plutôt qu'absolu.",
    codeInitial: `import math

def section_doree_relatif(f, a, b, eps):
    phi = (math.sqrt(5) - 1) / 2
    c = b - phi * (b - a); fc = f(c)
    d = a + phi * (b - a); fd = f(d)
    while ___:              # compléter : critère relatif
        if fc < fd:
            b = d; d = c; fd = fc
            c = b - phi * (b - a); fc = f(c)
        else:
            a = c; c = d; fc = fd
            d = a + phi * (b - a); fd = f(d)
    return (a + b) / 2
`,
  },
  {
    id: 22,
    titre: "Section dorée – Intervalle final",
    langage: "python",
    type: "ecriture",
    enonce: "Implémentez section_doree_intervalle(f, a, b, eps) qui retourne l'approximation du minimiseur x_star, l'intervalle final [a_final, b_final] et la valeur f(x_star).",
    codeInitial: `def section_doree_intervalle(f, a, b, eps):
    """
    Retourne :
        (x_star, a_final, b_final, f_x_star)
    """
    pass
`,
},
  // ─────────────────────────────────────────────
  // GRADIENT À PAS FIXE (questions 133–148)
  // ─────────────────────────────────────────────
  {
    id: 23, titre: "Gradient à pas fixe – Implémentation", langage: "python",
    type: "ecriture",
    enonce: "Implémentez gradient_pas_fixe(f, grad_f, x0, alpha, eps) qui minimise f par descente de gradient à pas fixe α. Retournez (x_star, nb_iterations, historique_f).",
    codeInitial: `import numpy as np

def gradient_pas_fixe(f, grad_f, x0, alpha, eps):
    """
    f      : fonction à minimiser
    grad_f : gradient de f
    x0     : point initial (array numpy)
    alpha  : pas fixe
    eps    : critère d'arrêt sur ||∇f(x)||
    Retourne (x_star, nb_iterations, historique_f)
    """
    pass
`,
  },
  {
    id: 24, titre: "Gradient à pas fixe – Mise à jour", langage: "python",
    type: "completion",
    enonce: "Complétez la mise à jour de x dans la boucle de la descente de gradient à pas fixe.",
    codeInitial: `import numpy as np

def gradient_pas_fixe(f, grad_f, x0, alpha, eps):
    x = np.array(x0, dtype=float)
    while True:
        g = grad_f(x)
        if np.linalg.norm(g) <= eps:
            break
        x = ___          # compléter la mise à jour
    return x
`,
  },
  {
    id: 25, titre: "Gradient à pas fixe – Correction", langage: "python",
    type: "correction",
    enonce: "Corrigez les erreurs dans ce code de descente de gradient à pas fixe.",
    codeInitial: `import numpy as np

def gradient_pas_fixe(f, grad_f, x0, alpha, eps):
    x = x0                          # manque conversion numpy
    while np.linalg.norm(x) > eps:  # erreur : mauvais critère
        g = grad_f(x)
        x = x + alpha * g           # erreur : mauvais signe
    return x
`,
  },
  {
    id: 26, titre: "Gradient à pas fixe – Divergence", langage: "python",
    type: "ecriture",
    enonce: "Implémentez `gradient_pas_fixe_securise(f, grad_f, x0, alpha, eps, max_iter=10000)` qui détecte la divergence (f augmente sur plusieurs itérations consécutives) et lève une RuntimeError avec un message explicatif.",
    codeInitial: `import numpy as np

def gradient_pas_fixe_securise(f, grad_f, x0, alpha, eps, max_iter=10000):
    """
    Version sécurisée : détecte et signale la divergence.
    """
    pass
`,
  },
  {
    id: 27, titre: "Gradient à pas fixe – Choix du pas", langage: "python",
    type: "ecriture",
    enonce: "Implémentez tester_pas(f, grad_f, x0, alphas, eps) qui teste plusieurs valeurs de pas α dans la liste `alphas`, exécute la descente de gradient pour chacune, et retourne le dictionnaire {alpha: (x_star, nb_iter)} pour les cas où la méthode converge.",
    codeInitial: `import numpy as np

def tester_pas(f, grad_f, x0, alphas, eps, max_iter=5000):
    """
    Retourne {alpha: (x_star, nb_iter)} pour les pas convergents.
    """
    pass
`,
  },
  {
    id: 28, titre: "Gradient à pas fixe – Condition de Lipschitz", langage: "python",
    type: "completion",
    enonce: "Complétez la fonction qui vérifie si le pas α respecte la condition de convergence α < 2/L, où L est la constante de Lipschitz du gradient fournie.",
    codeInitial: `def verifier_pas_lipschitz(alpha, L):
    """
    Retourne True si le pas garantit la convergence (α < 2/L).
    """
    return ___    # compléter
`,
  },
  {
    id: 29, titre: "Gradient à pas fixe – Norme du gradient", langage: "python",
    type: "completion",
    enonce: "Complétez le critère d'arrêt de la descente de gradient à pas fixe en utilisant la norme euclidienne du gradient.",
    codeInitial: `import numpy as np

def gradient_pas_fixe(f, grad_f, x0, alpha, eps):
    x = np.array(x0, dtype=float)
    nb_iter = 0
    while ___:              # compléter le critère d'arrêt
        g = grad_f(x)
        x = x - alpha * g
        nb_iter += 1
    return x, nb_iter
`,
  },
  {
    id: 30, titre: "Gradient à pas fixe – Cas quadratique", langage: "python",
    type: "ecriture",
    enonce: "Pour une fonction quadratique f(x) = ½xᵀAx - bᵀx avec A symétrique définie positive, implémentez `gradient_quadratique(A, b, x0, alpha, eps)` et vérifiez la convergence théorique.",
    codeInitial: `import numpy as np

def gradient_quadratique(A, b, x0, alpha, eps):
    """
    A   : matrice symétrique définie positive (numpy array)
    b   : vecteur (numpy array)
    x0  : point initial
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 31, titre: "Gradient à pas fixe – Critère sur f", langage: "python",
    type: "completion",
    enonce: "Complétez la version de la descente de gradient qui s'arrête si la variation relative de f entre deux itérations est inférieure à eps.",
    codeInitial: `import numpy as np

def gradient_critere_f(f, grad_f, x0, alpha, eps):
    x = np.array(x0, dtype=float)
    f_old = f(x)
    while True:
        g = grad_f(x)
        x = x - alpha * g
        f_new = f(x)
        if ___:          # compléter : variation relative < eps
            break
        f_old = f_new
    return x
`,
  },
  {
    id: 32, titre: "Gradient à pas fixe – Arrêt sur nombre max d'itérations", langage: "python",
    type: "completion",
    enonce: "Complétez la descente de gradient pour qu'elle s'arrête si le nombre maximum d'itérations max_iter est atteint, même si le critère de convergence n'est pas satisfait.",
    codeInitial: `import numpy as np

def gradient_pas_fixe(f, grad_f, x0, alpha, eps, max_iter=1000):
    x = np.array(x0, dtype=float)
    for k in range(___):      # compléter
        g = grad_f(x)
        if np.linalg.norm(g) <= eps:
            break
        x = x - alpha * g
    return x, k + 1
`,
  },

  // ─────────────────────────────────────────────
  // GRADIENT À PAS OPTIMAL (questions 149–162)
  // ─────────────────────────────────────────────
  {
    id: 33, titre: "Gradient à pas optimal – Implémentation", langage: "python",
    type: "ecriture",
    enonce: "Implémentez `gradient_pas_optimal(f, grad_f, x0, eps)` où le pas α* est déterminé à chaque itération par minimisation exacte de α ↦ f(x - α·∇f(x)). Utilisez scipy.optimize.minimize_scalar. Retournez (x_star, nb_iterations).",
    codeInitial: `import numpy as np
from scipy.optimize import minimize_scalar

def gradient_pas_optimal(f, grad_f, x0, eps):
    """
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 34, titre: "Gradient à pas optimal – Recherche linéaire", langage: "python",
    type: "completion",
    enonce: "Complétez le calcul du pas optimal α* à chaque itération dans la descente de gradient.",
    codeInitial: `import numpy as np
from scipy.optimize import minimize_scalar

def gradient_pas_optimal(f, grad_f, x0, eps):
    x = np.array(x0, dtype=float)
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        # Minimiser phi(alpha) = f(x - alpha * g)
        phi = lambda alpha: ___          # compléter
        res = minimize_scalar(phi, bounds=(0, 10), method='bounded')
        alpha_star = ___                 # compléter
        x = x - alpha_star * g
    return x
`,
  },
  {
    id: 35, titre: "Gradient à pas optimal – Pas quadratique exact", langage: "python",
    type: "ecriture",
    enonce: "Pour f(x) = ½xᵀAx - bᵀx, le pas optimal est α* = (gᵀg)/(gᵀAg). Implémentez `gradient_optimal_quadratique(A, b, x0, eps)` en utilisant cette formule analytique.",
    codeInitial: `import numpy as np

def gradient_optimal_quadratique(A, b, x0, eps):
    """
    Pas optimal analytique pour fonction quadratique.
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 36, titre: "Gradient à pas optimal – Correction", langage: "python",
    type: "correction",
    enonce: "Corrigez les erreurs dans ce code de gradient à pas optimal.",
    codeInitial: `import numpy as np
from scipy.optimize import minimize_scalar

def gradient_pas_optimal(f, grad_f, x0, eps):
    x = np.array(x0, dtype=float)
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        phi = lambda alpha: f(x + alpha * g)   # erreur : mauvais signe
        res = minimize_scalar(phi)
        alpha_star = res.fun                    # erreur : res.fun est la valeur, pas le point
        x = x - alpha_star * g
    return x
`,
  },
  {
    id: 37, titre: "Gradient à pas optimal – Condition d'Armijo", langage: "python",
    type: "ecriture",
    enonce: "Implémentez une recherche linéaire par la règle d'Armijo : `armijo(f, grad_f, x, g, sigma=0.5, beta=0.5)`. À partir de α=1, divisez par β tant que la condition de descente suffisante n'est pas satisfaite.",
    codeInitial: `import numpy as np

def armijo(f, grad_f, x, g, sigma=0.5, beta=0.5):
    """
    Recherche linéaire par backtracking (règle d'Armijo).
    g  : direction de descente
    Retourne alpha satisfaisant la condition d'Armijo.
    """
    pass
`,
  },
  {
    id: 38, titre: "Gradient à pas optimal – Backtracking", langage: "python",
    type: "completion",
    enonce: "Complétez la condition d'Armijo dans le backtracking line search.",
    codeInitial: `import numpy as np

def armijo(f, grad_f, x, g, sigma=1e-4, beta=0.5):
    alpha = 1.0
    f0 = f(x)
    grad_f0 = grad_f(x)
    while ___:              # compléter la condition d'Armijo
        alpha *= beta
    return alpha
`,
  },
 
  {
    id: 39, titre: "Gradient à pas optimal – Critère de Wolfe", langage: "python",
    type: "completion",
    enonce: "Complétez la condition de courbure (deuxième condition de Wolfe) dans ce backtracking.",
    codeInitial: `import numpy as np

def wolfe(f, grad_f, x, g, sigma1=1e-4, sigma2=0.9):
    alpha = 1.0
    f0, gf0 = f(x), grad_f(x)
    while True:
        x_new = x - alpha * g
        # Condition d'Armijo
        if f(x_new) > f0 - sigma1 * alpha * np.dot(gf0, g):
            alpha *= 0.5
        # Condition de courbure
        elif ___:               # compléter
            alpha *= 2.0
        else:
            break
    return alpha
`,
  },
  {
    id:40, titre: "Gradient à pas optimal – Descente dans R²", langage: "python",
    type: "ecriture",
    enonce: "Implémentez `descente_2d(A, b, x0, eps)` pour minimiser f(x) = ½xᵀAx - bᵀx dans R² avec le pas optimal analytique α* = (gᵀg)/(gᵀAg). Retournez l'historique des points.",
    codeInitial: `import numpy as np

def descente_2d(A, b, x0, eps):
    """
    A  : matrice 2×2 symétrique définie positive
    b  : vecteur de R²
    Retourne (x_star, historique_points)
    """
    pass
`,
  },
  // ─────────────────────────────────────────────
  // GRADIENT CONJUGUÉ (questions 163–178)
  // ─────────────────────────────────────────────
  {
    id: 41, titre: "Gradient conjugué – Implémentation complète", langage: "python",
    type: "ecriture",
    enonce: "Implémentez la méthode du gradient conjugué `gradient_conjugue(A, b, x0, eps)` pour résoudre Ax = b avec A symétrique définie positive. Retournez (x_star, nb_iterations).",
    codeInitial: `import numpy as np

def gradient_conjugue(A, b, x0, eps):
    """
    Résout Ax = b par gradient conjugué.
    A   : matrice symétrique définie positive
    b   : vecteur second membre
    x0  : point initial
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 42, titre: "Gradient conjugué – Mise à jour de β", langage: "python",
    type: "completion",
    enonce: "Complétez le calcul du coefficient β dans la méthode du gradient conjugué.",
    codeInitial: `import numpy as np

def gradient_conjugue(A, b, x0, eps):
    x = np.array(x0, dtype=float)
    r = b - A @ x
    d = r.copy()
    while np.linalg.norm(r) > eps:
        alpha = (r @ r) / (d @ A @ d)
        x = x + alpha * d
        r_new = r - alpha * A @ d
        beta = ___               # compléter
        d = r_new + beta * d
        r = r_new
    return x
`,
  },
  {
    id: 43, titre: "Gradient conjugué – Correction", langage: "python",
    type: "correction",
    enonce: "Corrigez les erreurs dans cette implémentation du gradient conjugué.",
    codeInitial: `import numpy as np

def gradient_conjugue(A, b, x0, eps):
    x = np.array(x0, dtype=float)
    r = b - A @ x
    d = r.copy()
    while np.linalg.norm(r) > eps:
        alpha = (r @ r) / (d @ d)        # erreur : dénominateur incorrect
        x = x + alpha * d
        r_new = r - alpha * A @ d
        beta = (r_new @ r_new) / (r @ r)
        d = r_new + beta * r             # erreur : doit être d, pas r
        r = r_new
    return x
`,
  },
  {
    id: 44, titre: "Gradient conjugué – Résidu initial", langage: "python",
    type: "completion",
    enonce: "Complétez l'initialisation du résidu r et de la direction d dans le gradient conjugué.",
    codeInitial: `import numpy as np

def gradient_conjugue(A, b, x0, eps):
    x = np.array(x0, dtype=float)
    r = ___          # compléter : résidu initial b - Ax0
    d = ___          # compléter : direction initiale = résidu
    while np.linalg.norm(r) > eps:
        alpha = (r @ r) / (d @ A @ d)
        x = x + alpha * d
        r_new = r - alpha * A @ d
        beta = (r_new @ r_new) / (r @ r)
        d = r_new + beta * d
        r = r_new
    return x
`,
  },

  {
    id: 45, titre: "Gradient conjugué – Pas α", langage: "python",
    type: "completion",
    enonce: "Complétez le calcul du pas α dans le gradient conjugué.",
    codeInitial: `import numpy as np

def gradient_conjugue(A, b, x0, eps):
    x = np.array(x0, dtype=float)
    r = b - A @ x
    d = r.copy()
    while np.linalg.norm(r) > eps:
        alpha = ___              # compléter : (r^T r) / (d^T A d)
        x = x + alpha * d
        r_new = r - alpha * A @ d
        beta = (r_new @ r_new) / (r @ r)
        d = r_new + beta * d
        r = r_new
    return x
`,
  },

  {
    id: 46, titre: "Gradient conjugué – Condition initiale x0 = 0", langage: "python",
    type: "completion",
    enonce: "Complétez la version du gradient conjugué démarrée à x0 = 0, pour laquelle le résidu initial est simplement b.",
    codeInitial: `import numpy as np

def gradient_conjugue_zero(A, b, eps):
    x = ___              # compléter : x0 = vecteur nul
    r = ___              # compléter : résidu initial simplifié
    d = r.copy()
    while np.linalg.norm(r) > eps:
        alpha = (r @ r) / (d @ A @ d)
        x = x + alpha * d
        r_new = r - alpha * A @ d
        beta = (r_new @ r_new) / (r @ r)
        d = r_new + beta * d
        r = r_new
    return x
`,
  },
  {
    id: 47, titre: "Gradient conjugué – Correction β", langage: "python",
    type: "correction",
    enonce: "Corrigez l'erreur dans le calcul du coefficient β de mise à jour de la direction conjuguée.",
    codeInitial: `import numpy as np

def gradient_conjugue(A, b, x0, eps):
    x = np.array(x0, dtype=float)
    r = b - A @ x
    d = r.copy()
    while np.linalg.norm(r) > eps:
        alpha = (r @ r) / (d @ A @ d)
        x = x + alpha * d
        r_new = r - alpha * A @ d
        beta = (r @ r) / (r_new @ r_new)   # erreur : numérateur et dénominateur inversés
        d = r_new + beta * d
        r = r_new
    return x
`,
  },
  // ─────────────────────────────────────────────
  // MÉTHODE DE NEWTON (questions 179–192)
  // ─────────────────────────────────────────────
  {
    id: 48, titre: "Newton – Implémentation complète", langage: "python",
    type: "ecriture",
    enonce: "Implémentez la méthode de Newton `newton(f, grad_f, hess_f, x0, eps)` pour minimiser f. Retournez (x_star, nb_iterations).",
    codeInitial: `import numpy as np

def newton(f, grad_f, hess_f, x0, eps):
    """
    f      : fonction à minimiser
    grad_f : gradient (retourne un array)
    hess_f : hessienne (retourne une matrice)
    x0     : point initial
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 49, titre: "Newton – Direction de descente", langage: "python",
    type: "completion",
    enonce: "Complétez le calcul de la direction de Newton p = H⁻¹·∇f(x). Utilisez numpy.linalg.solve plutôt que numpy.linalg.inv pour la stabilité numérique.",
    codeInitial: `import numpy as np

def newton(f, grad_f, hess_f, x0, eps):
    x = np.array(x0, dtype=float)
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        H = hess_f(x)
        p = ___          # compléter : résoudre H·p = g
        x = x - p
    return x
`,
  },
  {
    id: 50, titre: "Newton – Correction d'erreurs", langage: "python",
    type: "correction",
    enonce: "Corrigez les erreurs dans cette implémentation de la méthode de Newton.",
    codeInitial: `import numpy as np

def newton(f, grad_f, hess_f, x0, eps):
    x = np.array(x0, dtype=float)
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        H = hess_f(x)
        p = np.linalg.inv(H) @ H     # erreur : doit multiplier par g
        x = x + p                    # erreur : mauvais signe
    return x
`,
  },
  {
    id: 51, titre: "Newton – Convergence locale", langage: "python",
    type: "completion",
    enonce: "Complétez la vérification que la hessienne est définie positive avant d'appliquer Newton (valeurs propres toutes > 0).",
    codeInitial: `import numpy as np

def hessienne_definie_positive(H):
    """
    Retourne True si H est symétrique définie positive.
    """
    valeurs_propres = ___          # compléter
    return ___                     # compléter : toutes > 0
`,
  },
  {
    id: 52, titre: "Newton – Newton avec pas", langage: "python",
    type: "ecriture",
    enonce: "Implémentez `newton_avec_pas(f, grad_f, hess_f, x0, eps)` qui combine la direction de Newton avec une recherche linéaire par backtracking (Armijo) pour garantir la décroissance de f.",
    codeInitial: `import numpy as np

def newton_avec_pas(f, grad_f, hess_f, x0, eps):
    """
    Méthode de Newton globalisée par backtracking.
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 53, titre: "Newton – Singularité de la hessienne", langage: "python",
    type: "correction",
    enonce: "Corrigez ce code qui plante quand la hessienne est singulière. Ajoutez une gestion robuste avec un fallback vers la direction du gradient.",
    codeInitial: `import numpy as np

def newton(f, grad_f, hess_f, x0, eps):
    x = np.array(x0, dtype=float)
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        H = hess_f(x)
        p = np.linalg.solve(H, g)    # plante si H singulière
        x = x - p
    return x
`,
  },
  {
    id: 54, titre: "Newton – Critère d'arrêt sur la direction", langage: "python",
    type: "completion",
    enonce: "Complétez la méthode de Newton avec un critère d'arrêt basé sur la norme de la direction de Newton ||p|| < eps.",
    codeInitial: `import numpy as np

def newton_critere_direction(f, grad_f, hess_f, x0, eps):
    x = np.array(x0, dtype=float)
    while True:
        g = grad_f(x)
        H = hess_f(x)
        p = np.linalg.solve(H, g)
        if ___:          # compléter : critère sur ||p||
            break
        x = x - p
    return x
`,
  },
  
  // ─────────────────────────────────────────────
  // BFGS (questions 193–210)
  // ─────────────────────────────────────────────
  {
    id: 55, titre: "BFGS – Implémentation complète", langage: "python",
    type: "ecriture",
    enonce: "Implémentez l'algorithme BFGS `bfgs(f, grad_f, x0, eps)` avec mise à jour de l'approximation inverse de la hessienne. Utilisez une recherche linéaire par backtracking. Retournez (x_star, nb_iterations).",
    codeInitial: `import numpy as np

def bfgs(f, grad_f, x0, eps):
    """
    Algorithme BFGS avec backtracking.
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 56, titre: "BFGS – Mise à jour de H", langage: "python",
    type: "completion",
    enonce: "Complétez la formule de mise à jour de H dans BFGS.",
    codeInitial: `import numpy as np

def mise_a_jour_bfgs(H, s, y):
    """
    H : approximation courante de H⁻¹(∇²f)
    s : x_new - x
    y : grad_f(x_new) - grad_f(x)
    Retourne H mis à jour selon la formule BFGS.
    """
    rho = ___                    # compléter : 1 / (y^T s)
    I = np.eye(len(s))
    H_new = (I - rho * np.outer(s, y)) @ H @ (I - rho * np.outer(y, s)) \
            + ___                # compléter : rho * s * s^T
    return H_new
`,
  },
  {
    id: 57, titre: "BFGS – Correction d'erreurs", langage: "python",
    type: "correction",
    enonce: "Corrigez les erreurs dans cette implémentation BFGS.",
    codeInitial: `import numpy as np

def bfgs(f, grad_f, x0, eps):
    x = np.array(x0, dtype=float)
    H = np.eye(len(x))
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        p = H @ g                        # erreur : manque le signe moins
        alpha = 0.01                     # erreur : pas fixe, pas de recherche linéaire
        x_new = x + alpha * p
        s = x_new - x
        y = grad_f(x_new) - g
        rho = 1 / (y @ s)
        I = np.eye(len(x))
        H = (I - rho * np.outer(s, y)) @ H @ (I - rho * np.outer(y, s)) \
            + rho * np.outer(s, s)
        x = x_new
    return x
`,
  },
  {
    id: 58, titre: "BFGS – Initialisation de H", langage: "python",
    type: "completion",
    enonce: "Complétez l'initialisation de la matrice H dans BFGS (approximation initiale de l'inverse de la hessienne).",
    codeInitial: `import numpy as np

def bfgs(f, grad_f, x0, eps):
    x = np.array(x0, dtype=float)
    n = len(x)
    H = ___              # compléter : matrice identité n×n
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        p = -H @ g
        # ... (suite de l'algorithme)
    return x
`,
  },
  {
    id: 59, titre: "BFGS – Direction de descente", langage: "python",
    type: "completion",
    enonce: "Complétez le calcul de la direction de descente dans BFGS.",
    codeInitial: `import numpy as np

def bfgs(f, grad_f, x0, eps):
    x = np.array(x0, dtype=float)
    H = np.eye(len(x))
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        p = ___          # compléter : direction de descente BFGS
        # recherche linéaire...
        alpha = 1.0      # placeholder
        x_new = x + alpha * p
        s = x_new - x
        y = grad_f(x_new) - g
        # mise à jour H...
        x = x_new
    return x
`,
  },
   
  {
    id: 60, titre: "BFGS – Mise à jour de l'inverse directe", langage: "python",
    type: "completion",
    enonce: "BFGS maintient H = (∇²f)⁻¹ approximée. Complétez la mise à jour Sherman-Morrison-Woodbury.",
    codeInitial: `import numpy as np

def bfgs_update(H, s, y):
    """
    Formule BFGS complète (Sherman-Morrison-Woodbury).
    """
    rho = 1.0 / (y @ s)
    n = len(s)
    I = np.eye(n)
    A = I - rho * np.outer(___, ___)     # compléter : (s, y)
    B = I - rho * np.outer(___, ___)     # compléter : (y, s)
    return A @ H @ B + rho * np.outer(s, s)
`,
  },
  {
    id: 61, titre: "BFGS – Correction mise à jour mal conditionnée", langage: "python",
    type: "correction",
    enonce: "Le code BFGS suivant peut produire une matrice H non définie positive si yᵀs est très petit. Corrigez-le pour ignorer la mise à jour dans ce cas.",
    codeInitial: `import numpy as np

def bfgs(f, grad_f, x0, eps):
    x = np.array(x0, dtype=float)
    H = np.eye(len(x))
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        p = -H @ g
        alpha = 0.01
        x_new = x + alpha * p
        s = x_new - x
        y = grad_f(x_new) - g
        rho = 1 / (y @ s)   # plante si y^T s ≈ 0
        I = np.eye(len(x))
        H = (I - rho * np.outer(s, y)) @ H @ (I - rho * np.outer(y, s)) \
            + rho * np.outer(s, s)
        x = x_new
    return x
`,
  },

  // ─────────────────────────────────────────────
  // DFP (questions 211–230)
  // ─────────────────────────────────────────────
  {
    id: 62, titre: "DFP – Implémentation complète", langage: "python",
    type: "ecriture",
    enonce: "Implémentez l'algorithme DFP `dfp(f, grad_f, x0, eps)` avec mise à jour de l'approximation de la hessienne inverse. Retournez (x_star, nb_iterations).",
    codeInitial: `import numpy as np

def dfp(f, grad_f, x0, eps):
    """
    Algorithme DFP (Davidon-Fletcher-Powell).
    Retourne (x_star, nb_iterations)
    """
    pass
`,
  },
  {
    id: 63, titre: "DFP – Formule de mise à jour", langage: "python",
    type: "completion",
    enonce: "Complétez la formule de mise à jour DFP de la matrice H.",
    codeInitial: `import numpy as np

def mise_a_jour_dfp(H, s, y):
    """
    H : approximation courante de (∇²f)⁻¹
    s : x_new - x
    y : grad_f(x_new) - grad_f(x)
    Retourne H mis à jour selon DFP.
    """
    terme1 = ___    # compléter : (s s^T) / (s^T y)
    terme2 = ___    # compléter : (H y y^T H) / (y^T H y)
    return H + terme1 - terme2
`,
  },
  {
    id: 64, titre: "DFP – Correction d'erreurs", langage: "python",
    type: "correction",
    enonce: "Corrigez les erreurs dans cette implémentation DFP.",
    codeInitial: `import numpy as np

def dfp(f, grad_f, x0, eps):
    x = np.array(x0, dtype=float)
    H = np.eye(len(x))
    while np.linalg.norm(grad_f(x)) > eps:
        g = grad_f(x)
        p = -H @ g
        alpha = 0.1
        x_new = x + alpha * p
        s = x_new - x
        y = grad_f(x_new) - g
        sy = s @ y
        Hy = H @ y
        # Formule DFP incorrecte :
        H = H + np.outer(y, y) / sy - np.outer(Hy, Hy) / (y @ Hy)
        # erreur : doit être np.outer(s,s) au premier terme, pas np.outer(y,y)
        x = x_new
    return x
`,
  },
  
  {
    id: 65, titre: "DFP – Terme ssᵀ/(sᵀy)", langage: "python",
    type: "completion",
    enonce: "Complétez le calcul du premier terme de la mise à jour DFP : ssᵀ/(sᵀy).",
    codeInitial: `import numpy as np

def terme_dfp_1(s, y):
    """
    Retourne la matrice ssᵀ / (sᵀy).
    """
    return ___    # compléter
`,
  },
  {
    id: 66, titre: "DFP – Terme HyyᵀH/(yᵀHy)", langage: "python",
    type: "completion",
    enonce: "Complétez le calcul du deuxième terme de la mise à jour DFP : HyyᵀH/(yᵀHy).",
    codeInitial: `import numpy as np

def terme_dfp_2(H, y):
    """
    Retourne la matrice (H y y^T H) / (y^T H y).
    """
    Hy = H @ y
    return ___    # compléter
`,
  },
   // ─────────────────────────────────────────────
  // Autres questions (questions 67–100)
  // ─────────────────────────────────────────────
  {
    id: 67,
    titre: "SymPy – Déclaration de variables symboliques",
    langage: "python",
    type: "completion",
    enonce: "Déclarez deux variables symboliques x et y avec SymPy.",
    codeInitial: `import sympy as sp
 
# Déclarez x et y comme variables symboliques
___ = sp.symbols('x y')
`,
  },
  {
    id: 68,
    titre: "SymPy – Déclaration d'une fonction symbolique",
    langage: "python",
    type: "completion",
    enonce: "Déclarez la fonction symbolique f(x) = x**3 - 2*x + 1.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = ___
`,
  },
  {
    id: 69,
    titre: "SymPy – Dérivée d'une fonction",
    langage: "python",
    type: "completion",
    enonce: "Calculez la dérivée de f(x) = x**4 - 3*x**2 par rapport à x.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = x**4 - 3*x**2
 
df = ___    # dériver f par rapport à x
`,
  },
  {
    id: 70,
    titre: "SymPy – Dérivée partielle par rapport à x",
    langage: "python",
    type: "completion",
    enonce: "Calculez la dérivée partielle de f(x, y) = x**2 * y + y**3 par rapport à x.",
    codeInitial: `import sympy as sp
 
x, y = sp.symbols('x y')
f = x**2 * y + y**3
 
df_dx = ___    # dérivée partielle par rapport à x
`,
  },
  {
    id: 71,
    titre: "SymPy – Dérivée partielle par rapport à y",
    langage: "python",
    type: "completion",
    enonce: "Calculez la dérivée partielle de f(x, y) = x**2 * y + y**3 par rapport à y.",
    codeInitial: `import sympy as sp
 
x, y = sp.symbols('x y')
f = x**2 * y + y**3
 
df_dy = ___    # dérivée partielle par rapport à y
`,
  },
  {
    id: 72,
    titre: "SymPy – Gradient d'une fonction",
    langage: "python",
    type: "completion",
    enonce: "Calculez le gradient de f(x, y) = x**2 + x*y + y**2 sous forme de liste [df/dx, df/dy].",
    codeInitial: `import sympy as sp
 
x, y = sp.symbols('x y')
f = x**2 + x*y + y**2
 
gradient = ___    # liste des dérivées partielles
`,
  },
  {
    id: 73,
    titre: "SymPy – Matrice hessienne",
    langage: "python",
    type: "completion",
    enonce: "Calculez la matrice hessienne de f(x, y) = x**3 + y**3 - 3*x*y avec sp.hessian.",
    codeInitial: `import sympy as sp
 
x, y = sp.symbols('x y')
f = x**3 + y**3 - 3*x*y
 
H = ___    # hessienne de f par rapport à (x, y)
`,
  },
  {
    id: 74,
    titre: "SymPy – Évaluation avec subs",
    langage: "python",
    type: "completion",
    enonce: "Évaluez f(x) = x**2 - 4 en x = 3 avec la méthode subs.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = x**2 - 4
 
valeur = ___    # évaluer f en x=3
`,
  },
  {
    id: 75,
    titre: "SymPy – subs avec deux variables",
    langage: "python",
    type: "completion",
    enonce: "Évaluez f(x, y) = x**2 + y**2 au point (1, 2) avec subs.",
    codeInitial: `import sympy as sp
 
x, y = sp.symbols('x y')
f = x**2 + y**2
 
valeur = ___    # substituer x=1 et y=2
`,
  },
  {
    id: 76,
    titre: "SymPy – lambdify une variable",
    langage: "python",
    type: "completion",
    enonce: "Convertissez la fonction symbolique f(x) = sp.sin(x) + x**2 en fonction numérique avec lambdify.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = sp.sin(x) + x**2
 
f_num = ___    # convertir en fonction numérique numpy
`,
  },
  {
    id: 77,
    titre: "SymPy – lambdify deux variables",
    langage: "python",
    type: "completion",
    enonce: "Convertissez f(x, y) = x**2 + y**2 en fonction numérique avec lambdify.",
    codeInitial: `import sympy as sp
import numpy as np
 
x, y = sp.symbols('x y')
f = x**2 + y**2
 
f_num = ___    # lambdify avec numpy comme backend
`,
  },
  {
    id: 78,
    titre: "SymPy – Résolution d'équation avec solve",
    langage: "python",
    type: "completion",
    enonce: "Résolvez f'(x) = 0 pour f(x) = x**3 - 3*x afin de trouver les points critiques.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = x**3 - 3*x
df = sp.diff(f, x)
 
points_critiques = ___    # résoudre df = 0
`,
  },
  {
    id: 79,
    titre: "SymPy – Dérivée seconde",
    langage: "python",
    type: "completion",
    enonce: "Calculez la dérivée seconde de f(x) = x**4 - 6*x**2 par rapport à x.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = x**4 - 6*x**2
 
d2f = ___    # dérivée seconde de f
`,
  },
  {
    id: 80,
    titre: "SymPy – Classification : minimum local",
    langage: "python",
    type: "completion",
    enonce: "Évaluez la dérivée seconde de f(x) = x**2 au point critique x=0 pour classifier le point.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = x**2
d2f = sp.diff(f, x, 2)
 
valeur_d2f = ___    # évaluer d²f en x=0
# Si valeur_d2f > 0 : minimum local
`,
  },
  {
    id: 81,
    titre: "SymPy – Classification : maximum local",
    langage: "python",
    type: "completion",
    enonce: "Évaluez la dérivée seconde de f(x) = -x**2 + 4*x en x=2 pour classifier le point.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = -x**2 + 4*x
d2f = sp.diff(f, x, 2)
 
valeur_d2f = ___    # évaluer d²f en x=2
# Si valeur_d2f < 0 : maximum local
`,
  },
  {
    id: 82,
    titre: "SymPy – Déterminant de la hessienne",
    langage: "python",
    type: "completion",
    enonce: "Calculez le déterminant de la matrice hessienne H de f(x,y) = x**2 + y**2 pour classifier un point critique.",
    codeInitial: `import sympy as sp
 
x, y = sp.symbols('x y')
f = x**2 + y**2
H = sp.hessian(f, (x, y))
 
det_H = ___    # déterminant de H
`,
  },
  {
    id: 83,
    titre: "SymPy – Classification : point selle",
    langage: "python",
    type: "completion",
    enonce: "Calculez le déterminant de la hessienne de f(x,y) = x**2 - y**2 en (0,0). Un déterminant négatif indique un point selle.",
    codeInitial: `import sympy as sp
 
x, y = sp.symbols('x y')
f = x**2 - y**2
H = sp.hessian(f, (x, y))
det_H = H.det()
 
valeur_det = ___    # évaluer det_H en (0, 0)
`,
  },
  {
    id: 84,
    titre: "SymPy – Résolution système d'équations",
    langage: "python",
    type: "completion",
    enonce: "Résolvez le système {df/dx = 0, df/dy = 0} pour f(x,y) = x**2 + y**2 - 2*x avec sp.solve.",
    codeInitial: `import sympy as sp
 
x, y = sp.symbols('x y')
f = x**2 + y**2 - 2*x
df_dx = sp.diff(f, x)
df_dy = sp.diff(f, y)
 
points = ___    # résoudre le système [df_dx, df_dy] = 0
`,
  },
  {
    id: 85,
    titre: "SymPy – Matrice symbolique",
    langage: "python",
    type: "completion",
    enonce: "Créez la matrice symbolique A = [[1, 2], [3, 4]] avec sp.Matrix.",
    codeInitial: `import sympy as sp
 
A = ___    # créer la matrice 2x2 avec sp.Matrix
`,
  },
  {
    id: 86,
    titre: "SymPy – Inverse d'une matrice",
    langage: "python",
    type: "completion",
    enonce: "Calculez l'inverse de la matrice A = sp.Matrix([[2, 1], [1, 1]]) avec SymPy.",
    codeInitial: `import sympy as sp
 
A = sp.Matrix([[2, 1], [1, 1]])
 
A_inv = ___    # inverse de A
`,
  },
  {
    id: 87,
    titre: "NumPy – Création d'un vecteur",
    langage: "python",
    type: "completion",
    enonce: "Créez le vecteur NumPy v = [1, 2, 3] avec np.array.",
    codeInitial: `import numpy as np
 
v = ___    # créer le vecteur [1, 2, 3]
`,
  },
  {
    id: 88,
    titre: "NumPy – Création d'une matrice",
    langage: "python",
    type: "completion",
    enonce: "Créez la matrice NumPy A = [[1, 2], [3, 4]] avec np.array.",
    codeInitial: `import numpy as np
 
A = ___    # créer la matrice 2x2
`,
  },
  {
    id: 89,
    titre: "NumPy – Produit matrice-vecteur",
    langage: "python",
    type: "completion",
    enonce: "Calculez le produit A @ v où A est une matrice 2x2 et v un vecteur de taille 2.",
    codeInitial: `import numpy as np
 
A = np.array([[1, 2], [3, 4]])
v = np.array([1, 0])
 
Av = ___    # produit matrice-vecteur
`,
  },
  {
    id: 90,
    titre: "NumPy – Résolution d'un système linéaire",
    langage: "python",
    type: "completion",
    enonce: "Résolvez le système linéaire Ax = b avec NumPy, où A = [[2,1],[1,3]] et b = [5, 10].",
    codeInitial: `import numpy as np
 
A = np.array([[2, 1], [1, 3]], dtype=float)
b = np.array([5, 10], dtype=float)
 
x = ___    # résoudre Ax = b
`,
  },
  {
    id: 91,
    titre: "NumPy – Valeurs propres",
    langage: "python",
    type: "completion",
    enonce: "Calculez les valeurs propres de la matrice A = [[4, 1], [2, 3]] avec NumPy.",
    codeInitial: `import numpy as np
 
A = np.array([[4, 1], [2, 3]], dtype=float)
 
valeurs_propres = ___    # valeurs propres de A
`,
  },
  {
    id: 92,
    titre: "NumPy – Norme d'un vecteur",
    langage: "python",
    type: "completion",
    enonce: "Calculez la norme euclidienne du vecteur v = [3, 4] avec NumPy.",
    codeInitial: `import numpy as np
 
v = np.array([3, 4], dtype=float)
 
norme = ___    # norme euclidienne de v
`,
  },
  {
    id: 93,
    titre: "NumPy – Matrice identité",
    langage: "python",
    type: "completion",
    enonce: "Créez la matrice identité de taille 3x3 avec NumPy.",
    codeInitial: `import numpy as np
 
I = ___    # matrice identité 3x3
`,
  },
  {
    id: 94,
    titre: "NumPy – Transposée d'une matrice",
    langage: "python",
    type: "completion",
    enonce: "Calculez la transposée de la matrice A = [[1, 2, 3], [4, 5, 6]].",
    codeInitial: `import numpy as np
 
A = np.array([[1, 2, 3], [4, 5, 6]])
 
A_T = ___    # transposée de A
`,
  },
  {
    id: 95,
    titre: "Matplotlib – Tracé d'une fonction",
    langage: "python",
    type: "completion",
    enonce: "Complétez le code pour tracer f(x) = x**2 sur l'intervalle [-3, 3] avec matplotlib.",
    codeInitial: `import numpy as np
import matplotlib.pyplot as plt
 
x = np.linspace(-3, 3, 100)
y = ___    # calculer f(x) = x**2
 
plt.plot(x, y)
plt.title("f(x) = x²")
plt.show()
`,
  },
  {
    id: 96,
    titre: "Matplotlib – Tracé d'une fonction de deux variables",
    langage: "python",
    type: "completion",
    enonce: "Complétez le code pour créer la grille de valeurs Z = X**2 + Y**2 à partir des matrices X et Y.",
    codeInitial: `import numpy as np
import matplotlib.pyplot as plt
 
x = np.linspace(-3, 3, 50)
y = np.linspace(-3, 3, 50)
X, Y = np.meshgrid(x, y)
 
Z = ___    # calculer Z = X² + Y²
 
plt.contourf(X, Y, Z, levels=20)
plt.colorbar()
plt.show()
`,
  },
  {
    id: 97,
    titre: "SymPy – Vérification d'un minimum global",
    langage: "python",
    type: "completion",
    enonce: "Évaluez f(x) = x**2 + 2 au point x=0 pour vérifier que c'est un minimum global (valeur minimale attendue : 2).",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = x**2 + 2
 
valeur_min = ___    # évaluer f en x=0
`,
  },
  {
    id: 98,
    titre: "SymPy – diff avec ordre spécifié",
    langage: "python",
    type: "completion",
    enonce: "Calculez la dérivée d'ordre 3 de f(x) = x**5 par rapport à x avec sp.diff.",
    codeInitial: `import sympy as sp
 
x = sp.symbols('x')
f = x**5
 
d3f = ___    # dérivée d'ordre 3
`,
  },
  {
    id: 99,
    titre: "NumPy – Produit scalaire",
    langage: "python",
    type: "completion",
    enonce: "Calculez le produit scalaire entre u = [1, 2, 3] et v = [4, 5, 6] avec NumPy.",
    codeInitial: `import numpy as np
 
u = np.array([1, 2, 3], dtype=float)
v = np.array([4, 5, 6], dtype=float)
 
produit = ___    # produit scalaire u · v
`,
  },
  {
    id: 100,
    titre: "SymPy – Gradient numérique via lambdify",
    langage: "python",
    type: "completion",
    enonce: "Convertissez le gradient de f(x, y) = x**2 + y**2 en fonctions numériques et évaluez-les au point (1, 2).",
    codeInitial: `import sympy as sp
import numpy as np
 
x, y = sp.symbols('x y')
f = x**2 + y**2
 
df_dx = sp.diff(f, x)
df_dy = sp.diff(f, y)
 
grad_x = sp.lambdify((x, y), df_dx, 'numpy')
grad_y = sp.lambdify((x, y), df_dy, 'numpy')
 
# Évaluer le gradient au point (1, 2)
gradient_en_point = ___    # liste [grad_x(1,2), grad_y(1,2)]
`,
  },
];
