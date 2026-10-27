import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

interface Guide {
  title: string;
  text: string;
  route: string;
  icon: string;
}

interface Faq {
  q: string;
  a: string;
}

@Component({
  selector: 'app-centre-aide',
  imports: [RouterLink, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './centre-aide.html',
  styleUrl: './centre-aide.scss',
})
export class CentreAide {
  protected readonly guides: Guide[] = [
    { title: 'Suivre le patrimoine', text: 'Consulter un bien, sa valeur comptable et son statut.', route: '/inventaire', icon: 'tablerBuildingSkyscraper' },
    { title: 'Gérer les baux', text: 'Contrats donnés et pris, révisions et échéances de loyer.', route: '/location/baux-donnes', icon: 'tablerHome2' },
    { title: 'Traiter les alertes', text: 'Comprendre les niveaux d’urgence et marquer une alerte comme lue.', route: '/notifications', icon: 'tablerBell' },
    { title: 'Retrouver un document', text: 'Actes, plans et autorisations rattachés à chaque bien.', route: '/ged', icon: 'tablerFileStack' },
  ];

  private readonly faqs: Faq[] = [
    { q: 'Comment ajouter un nouveau bien ?', a: 'Ouvrez la Base patrimoniale puis utilisez le bouton « Nouveau bien ». Seule la désignation est obligatoire, les autres champs peuvent être complétés plus tard depuis la fiche du bien.' },
    { q: 'Que signifient les couleurs des statuts ?', a: 'Vert : situation normale ou terminée. Bleu : en cours. Orange : action ou décision attendue. Rouge : problème ou retard. Gris : neutre ou archivé. Le texte du statut est toujours affiché, la couleur ne porte jamais seule l’information.' },
    { q: 'Comment exporter une liste ?', a: 'Chaque liste propose un bouton « Exporter ». Le fichier CSV contient les lignes correspondant à la recherche et au filtre de statut en cours, il s’ouvre directement dans Excel.' },
    { q: 'Pourquoi une alerte reste-t-elle non lue ?', a: 'Une alerte passe à « lue » quand vous l’ouvrez depuis la page Alertes ou que vous utilisez « Tout marquer comme lu ». Elle disparaît définitivement quand la cause est traitée dans le module concerné.' },
    { q: 'Qui peut modifier les profils et les permissions ?', a: 'Les profils sont gérés dans Administration > Environnement > Accès Management. La page Paramètres > Permissions affiche la matrice des droits par profil.' },
    { q: 'Les données affichées sont-elles réelles ?', a: 'Les modules sans service connecté affichent des données de démonstration, signalées par une pastille orange en haut de page. Les modifications faites dans ces pages ne sont pas sauvegardées.' },
  ];

  protected readonly query = signal('');
  protected readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.faqs.filter((f) => (f.q + f.a).toLowerCase().includes(q)) : this.faqs;
  });
}
