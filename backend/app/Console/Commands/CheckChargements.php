<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Chargement;
use App\Models\Wagon;
use Carbon\Carbon;

class CheckChargements extends Command
{
    protected $signature = 'chargements:check';
    protected $description = 'Vérifie les chargements terminés et met à jour les wagons';

    public function handle()
    {
        $chargements = Chargement::where('statut', 'en cuisson')
            ->where('datetime_sortieEstime', '<=', Carbon::now())
            ->get();

        foreach ($chargements as $chargement) {
            $chargement->statut = 'sorti';
            $chargement->save();

            $wagon = Wagon::find($chargement->id_wagon);
            if ($wagon) {
                $wagon->statut = 'disponible';
                $wagon->save();
            }
        }

        $this->info(count($chargements) . ' chargements mis à jour.');
    }
}
